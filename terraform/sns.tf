resource "aws_sns_topic" "gate_alerts" {
  name         = "MITADT_Campus_Gate_Alerts"
  display_name = "TraffiQ Alerts"

  tags = {
    Purpose = "Campus Gate Congestion and Highway Delay Broadcasts"
  }
}

