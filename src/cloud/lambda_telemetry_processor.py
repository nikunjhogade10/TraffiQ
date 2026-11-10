"""
================================================================================
PROJECT: TraffiQ — MIT-ADT Campus Smart Traffic and Gate Monitoring System
MODULE: AWS Lambda Cloud Telemetry Processor & Rule Evaluator
PROJECT LOCATION: MIT Art, Design and Technology University, Rajbaug Campus,
                  Loni Kalbhor, Pune - 412201, Maharashtra, India
================================================================================
RUNTIME: Python 3.11 / AWS Lambda (ap-south-1 Mumbai)
TRIGGER: AWS IoT Rule on Topic: mitadt/campus/gate/main/telemetry
PERSISTENCE: Amazon DynamoDB Table: MITADT_Campus_Traffic_Telemetry
================================================================================
"""

import os
import json
import logging
from datetime import datetime
from typing import Dict, Any

# Configure Logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Optional boto3 import for deployment in AWS Lambda environment
try:
    import boto3
    dynamodb = boto3.resource("dynamodb", region_name="ap-south-1")
    table_name = os.environ.get("DYNAMODB_TABLE_NAME", "MITADT_Campus_Traffic_Telemetry")
    table = dynamodb.Table(table_name)
    AWS_BOTO_AVAILABLE = True
except ImportError:
    table = None
    AWS_BOTO_AVAILABLE = False
    logger.info("Running in offline verification mode without AWS boto3.")


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    AWS Lambda ingestion handler for MIT-ADT Main Campus Gate telemetry.
    Parses payload from AWS IoT Core, evaluates congestion rules, and stores record in DynamoDB.
    """
    logger.info(f"Received IoT event: {json.dumps(event)}")

    # Extract core telemetry attributes
    gate_id = event.get("gateId", "main")
    timestamp = event.get("timestamp", datetime.utcnow().isoformat() + "Z")
    telemetry = event.get("telemetry", {})

    traffic_level = telemetry.get("trafficLevel", "Low Traffic")
    pir_triggers = telemetry.get("pirTriggersPerMin", 0)
    measured_dist = telemetry.get("measuredDistance", "--")
    pir_status = telemetry.get("pirStatus", "online")
    ultrasonic_status = telemetry.get("ultrasonicStatus", "online")

    # Evaluate Travel Recommendations & Delay Estimates
    estimated_delay = "< 1 min (Clear)"
    recommendation = "Clear passage. Free flow exiting onto Pune-Solapur Highway access road."

    if traffic_level == "Heavy Traffic":
        estimated_delay = "8 - 12 mins delay"
        recommendation = "Heavy vehicle queuing before security checkpoint. Consider staggering departure."
    elif traffic_level == "Moderate Traffic":
        estimated_delay = "3 - 5 mins delay"
        recommendation = "Slow vehicle movement. Normal clearance speed at Main Gate."
    elif traffic_level == "Sensor Offline":
        estimated_delay = "Status Unknown"
        recommendation = "Edge sensor telemetry offline. Proceed with standard caution."

    processed_record = {
        "gateId": gate_id,
        "timestamp": timestamp,
        "trafficLevel": traffic_level,
        "motionActivity": telemetry.get("motionActivity", "Low"),
        "pirTriggersPerMin": pir_triggers,
        "measuredDistance": measured_dist,
        "estimatedDelay": estimated_delay,
        "recommendation": recommendation,
        "pirStatus": pir_status,
        "ultrasonicStatus": ultrasonic_status,
        "campus": "MIT-ADT University Rajbaug Campus, Loni Kalbhor",
        "highway": "Pune-Solapur Highway (NH 65)",
        "ttl": int(datetime.utcnow().timestamp()) + (86400 * 30) # 30-day retention
    }

    # Persist record in DynamoDB
    if AWS_BOTO_AVAILABLE and table:
        try:
            table.put_item(Item=processed_record)
            logger.info(f"Persisted record to DynamoDB: {gate_id} @ {timestamp}")
        except Exception as exc:
            logger.error(f"Error persisting record to DynamoDB: {exc}")
            return {
                "statusCode": 500,
                "body": json.dumps({"error": str(exc)})
            }

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Telemetry evaluated and stored successfully.",
            "record": processed_record
        })
    }
