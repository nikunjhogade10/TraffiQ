output "aws_region" {
  description = "Deployed AWS Region"
  value       = var.aws_region
}

output "iot_endpoint" {
  description = "AWS IoT Core Data-ATS MQTT Endpoint"
  value       = data.aws_iot_endpoint.iot_endpoint.endpoint_address
}

output "iot_thing_name" {
  description = "AWS IoT Thing Name"
  value       = aws_iot_thing.edge_node.name
}

output "iot_topic" {
  description = "MQTT Ingestion Topic"
  value       = var.iot_topic
}

output "dynamodb_table_name" {
  description = "Amazon DynamoDB Telemetry Table"
  value       = aws_dynamodb_table.traffic_telemetry.name
}

output "dynamodb_table_arn" {
  description = "Amazon DynamoDB Table ARN"
  value       = aws_dynamodb_table.traffic_telemetry.arn
}

output "lambda_function_name" {
  description = "Telemetry Processor Lambda Function Name"
  value       = aws_lambda_function.telemetry_processor.function_name
}

output "sns_topic_arn" {
  description = "Campus Gate Alerts SNS Topic ARN"
  value       = aws_sns_topic.gate_alerts.arn
}

output "device_cert_file" {
  description = "Generated X.509 device certificate on local disk"
  value       = local_file.device_cert.filename
}

output "device_private_key_file" {
  description = "Generated private key on local disk"
  value       = local_file.private_key.filename
}

output "root_ca_file" {
  description = "Amazon Root CA certificate on local disk"
  value       = local_file.root_ca.filename
}

output "email_dispatcher_url" {
  description = "Public HTTPS Lambda Function URL for OTP Email Dispatcher"
  value       = aws_lambda_function_url.email_dispatcher_url.function_url
}


