data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/../src/cloud/lambda_telemetry_processor.py"
  output_path = "${path.module}/dist/lambda_telemetry_processor.zip"
}

resource "aws_iam_role" "lambda_exec" {
  name = "traffiq-telemetry-processor-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "lambda_dynamodb_sns" {
  name = "traffiq-lambda-dynamodb-sns-policy"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:GetItem"
        ]
        Resource = aws_dynamodb_table.traffic_telemetry.arn
      },
      {
        Effect = "Allow"
        Action = [
          "sns:Publish"
        ]
        Resource = aws_sns_topic.gate_alerts.arn
      }
    ]
  })
}

resource "aws_lambda_function" "telemetry_processor" {
  function_name    = "TraffiQ_Telemetry_Processor"
  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  role             = aws_iam_role.lambda_exec.arn
  handler          = "lambda_telemetry_processor.lambda_handler"
  runtime          = "python3.11"
  timeout          = 15
  memory_size      = 256

  environment {
    variables = {
      DYNAMODB_TABLE_NAME = aws_dynamodb_table.traffic_telemetry.name
      SNS_TOPIC_ARN       = aws_sns_topic.gate_alerts.arn
    }
  }

  tags = {
    Name = "TraffiQ_Telemetry_Processor"
  }
}

resource "aws_lambda_permission" "allow_iot_invoke" {
  statement_id  = "AllowExecutionFromAWSIoT"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.telemetry_processor.function_name
  principal     = "iot.amazonaws.com"
  source_arn    = "arn:aws:iot:${var.aws_region}:${data.aws_caller_identity.current.account_id}:rule/*"
}

data "aws_caller_identity" "current" {}

