resource "aws_dynamodb_table" "traffic_telemetry" {
  name         = var.dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST"

  hash_key  = "gateId"
  range_key = "timestamp"

  attribute {
    name = "gateId"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Name = var.dynamodb_table_name
  }
}

