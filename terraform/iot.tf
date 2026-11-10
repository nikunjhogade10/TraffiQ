data "aws_iot_endpoint" "iot_endpoint" {
  endpoint_type = "iot:Data-ATS"
}

resource "aws_iot_thing" "edge_node" {
  name = var.iot_thing_name

  attributes = {
    Campus   = "Rajbaug_Campus"
    Gate     = "Main_Campus_Gate"
    Hardware = "Raspberry_Pi_3B_Plus"
  }
}

resource "aws_iot_certificate" "edge_cert" {
  active = true
}

resource "aws_iot_policy" "edge_policy" {
  name = "traffiq-main-gate-edge-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "iot:Connect"
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "iot:Publish",
          "iot:Receive"
        ]
        Resource = "arn:aws:iot:${var.aws_region}:${data.aws_caller_identity.current.account_id}:topic/${var.iot_topic}"
      },
      {
        Effect   = "Allow"
        Action   = "iot:Subscribe"
        Resource = "arn:aws:iot:${var.aws_region}:${data.aws_caller_identity.current.account_id}:topicfilter/${var.iot_topic}"
      }
    ]
  })
}

resource "aws_iot_policy_attachment" "cert_policy_attach" {
  policy = aws_iot_policy.edge_policy.name
  target = aws_iot_certificate.edge_cert.arn
}

resource "aws_iot_thing_principal_attachment" "thing_cert_attach" {
  principal = aws_iot_certificate.edge_cert.arn
  thing     = aws_iot_thing.edge_node.name
}

data "http" "amazon_root_ca" {
  url = "https://www.amazontrust.com/repository/AmazonRootCA1.pem"
}

resource "local_file" "device_cert" {
  content  = aws_iot_certificate.edge_cert.certificate_pem
  filename = "${path.module}/../certs/certificate.pem.crt"
}

resource "local_file" "private_key" {
  content         = aws_iot_certificate.edge_cert.private_key
  filename        = "${path.module}/../certs/private.pem.key"
  file_permission = "0600"
}

resource "local_file" "root_ca" {
  content  = data.http.amazon_root_ca.response_body
  filename = "${path.module}/../certs/AmazonRootCA1.pem"
}

resource "aws_iot_topic_rule" "telemetry_rule" {
  name        = "traffiq_main_gate_telemetry_rule"
  description = "Routes physical edge telemetry to TraffiQ Lambda processor"
  enabled     = true
  sql         = "SELECT * FROM '${var.iot_topic}'"
  sql_version = "2016-03-23"

  lambda {
    function_arn = aws_lambda_function.telemetry_processor.arn
  }
}

