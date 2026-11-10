variable "aws_region" {
  description = "AWS Region for TraffiQ cloud infrastructure (Mumbai for ultra-low latency to Pune)"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project identifier"
  type        = string
  default     = "traffiq"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "iot_thing_name" {
  description = "AWS IoT Core Thing name for Raspberry Pi edge node"
  type        = string
  default     = "mitadt-main-gate-rpi3-node"
}

variable "iot_topic" {
  description = "MQTT topic for edge gate telemetry"
  type        = string
  default     = "mitadt/campus/gate/main/telemetry"
}

variable "dynamodb_table_name" {
  description = "Amazon DynamoDB table name for campus traffic telemetry persistence"
  type        = string
  default     = "MITADT_Campus_Traffic_Telemetry"
}


variable "gmail_sender_email" {
  description = "Sender Gmail address for dispatching OTP verification codes"
  type        = string
  default     = ""
  sensitive   = true
}

variable "gmail_app_password" {
  description = "16-character Google App Password for Gmail SMTP"
  type        = string
  default     = ""
  sensitive   = true
}
