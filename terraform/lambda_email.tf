# ── AWS Lambda Email Dispatcher for TraffiQ OTP Verification ──

data "archive_file" "email_lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/../src/cloud/lambda_email_dispatcher.py"
  output_path = "${path.module}/dist/lambda_email_dispatcher.zip"
}

resource "aws_lambda_function" "email_dispatcher" {
  function_name    = "TraffiQ_Email_Dispatcher"
  filename         = data.archive_file.email_lambda_zip.output_path
  source_code_hash = data.archive_file.email_lambda_zip.output_base64sha256
  role             = aws_iam_role.lambda_exec.arn
  handler          = "lambda_email_dispatcher.lambda_handler"
  runtime          = "python3.11"
  timeout          = 15
  memory_size      = 256

  environment {
    variables = {
      GMAIL_SENDER_EMAIL = var.gmail_sender_email
      GMAIL_APP_PASSWORD = var.gmail_app_password
    }
  }

  tags = {
    Name    = "TraffiQ_Email_Dispatcher"
    Purpose = "Sends 6-digit OTP codes for Student and Security Authentication"
  }
}

# Public Lambda Function URL with built-in CORS for Web & Mobile
resource "aws_lambda_function_url" "email_dispatcher_url" {
  function_name      = aws_lambda_function.email_dispatcher.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = false
    allow_origins     = ["*"]
    allow_methods     = ["*"]
    allow_headers     = ["*"]
    max_age           = 300
  }
}

# Allow public invocations of Function URL
resource "aws_lambda_permission" "allow_public_url" {
  statement_id           = "FunctionURLAllowPublicAccess"
  action                 = "lambda:InvokeFunctionUrl"
  function_name          = aws_lambda_function.email_dispatcher.function_name
  principal              = "*"
  function_url_auth_type = "NONE"
}

resource "aws_lambda_permission" "allow_public_url_invoke" {
  statement_id           = "FunctionURLAllowPublicInvoke"
  action                 = "lambda:InvokeFunction"
  function_name          = aws_lambda_function.email_dispatcher.function_name
  principal              = "*"
}

