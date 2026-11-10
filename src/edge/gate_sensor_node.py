"""
================================================================================
PROJECT: TraffiQ — MIT-ADT Campus Smart Traffic and Gate Monitoring System
MODULE: Edge IoT Node Telemetry Collector
COPYRIGHT: Copyright (c) 2026 — Authors: Rajani Sangappa Sajjan,
           Nikunj Santosh Hogade, Adwait Pravin Kharade,
           Shriraj Omkar Salunke, and Arayan Atul Londhe.
           All Rights Reserved.
PROJECT LOCATION: MIT Art, Design and Technology University, Rajbaug Campus,
                  Loni Kalbhor, Pune - 412201, Maharashtra, India
================================================================================
HARDWARE TARGET: Raspberry Pi 4 Model B
SENSORS:
  - PIR Motion Sensor: GPIO 17 (Digital Input)
  - HC-SR04 Ultrasonic Sensor: Trig GPIO 27, Echo GPIO 22
CONNECTIVITY: AWS IoT Core (ap-south-1 Mumbai) via MQTT over TLS (Port 8883)
MQTT TOPIC: mitadt/campus/gate/main/telemetry
================================================================================
"""

from __future__ import annotations

import os
import sys
import time
import json
import ssl
import logging
import threading
from collections import deque
from http.server import HTTPServer, BaseHTTPRequestHandler
from datetime import datetime, timezone
from typing import Dict, Any, Optional, Tuple

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("TraffiQ-EdgeNode")

# Hardware Pins Configuration (BCM numbering)
PIR_GPIO_PIN = 17

# Ultrasonic Sensor 1 (Primary / Gate Queue)
ULTRASONIC_1_TRIG_PIN = 27
ULTRASONIC_1_ECHO_PIN = 22

# Ultrasonic Sensor 2 (Secondary / Barrier Clearance)
ULTRASONIC_2_TRIG_PIN = 23
ULTRASONIC_2_ECHO_PIN = 24

# Backward compatibility alias
ULTRASONIC_TRIG_PIN = ULTRASONIC_1_TRIG_PIN
ULTRASONIC_ECHO_PIN = ULTRASONIC_1_ECHO_PIN

# HTTP Server Configuration for Direct App Connection
HTTP_BRIDGE_PORT = 8000


class TelemetryHTTPHandler(BaseHTTPRequestHandler):
    """Zero-dependency HTTP server delivering live sensor telemetry to the TraffiQ App."""
    latest_telemetry_getter = None
    history_getter = None

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.end_headers()

    def do_GET(self):
        try:
            if self.path in ("/telemetry", "/", "/api/telemetry"):
                payload = self.latest_telemetry_getter() if self.latest_telemetry_getter else None
                if not payload:
                    payload = {"status": "initializing", "message": "Sensor node warming up"}
                body = json.dumps(payload, indent=2).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
            elif self.path in ("/analytics", "/history", "/api/analytics"):
                hist = list(self.history_getter()) if self.history_getter else []
                body = json.dumps({
                    "status": "ok",
                    "totalReadings": len(hist),
                    "history": hist
                }, indent=2).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
            elif self.path in ("/health", "/api/health"):
                body = json.dumps({
                    "status": "online",
                    "device": "Raspberry Pi 3 Model B+",
                    "location": "MIT-ADT University Main Campus Gate",
                    "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
                }).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
            else:
                self.send_response(404)
                self.end_headers()
        except Exception as exc:
            err_body = json.dumps({"error": str(exc)}).encode("utf-8")
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-Length", str(len(err_body)))
            self.end_headers()
            self.wfile.write(err_body)

    def log_message(self, format, *args):
        # Silence routine request logging
        pass

# MQTT Configuration
AWS_REGION = "ap-south-1"
AWS_IOT_ENDPOINT = "a2o8l366kav7ud-ats.iot.ap-south-1.amazonaws.com"
AWS_IOT_PORT = 8883
AWS_IOT_TOPIC = "mitadt/campus/gate/main/telemetry"
DEVICE_CLIENT_ID = "mitadt-main-gate-rpi3-node"

CERT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "certs")
ROOT_CA_PATH = os.path.join(CERT_DIR, "AmazonRootCA1.pem")
CERTIFICATE_PATH = os.path.join(CERT_DIR, "certificate.pem.crt")
PRIVATE_KEY_PATH = os.path.join(CERT_DIR, "private.pem.key")

# Attempt importing Paho MQTT with graceful fallback for local development
PAHO_AVAILABLE = False
paho_mqtt: Any = None
try:
    import paho.mqtt.client as paho_mqtt  # type: ignore
    PAHO_AVAILABLE = True
except (ImportError, ModuleNotFoundError):
    paho_mqtt = None
    PAHO_AVAILABLE = False

# Attempt importing hardware libraries (prioritize gpiozero for Bookworm, fallback to RPi.GPIO)
GPIOZERO_AVAILABLE = False
RPIGPIO_AVAILABLE = False
DistanceSensor: Any = None
MotionSensor: Any = None
GPIO: Any = None

try:
    from gpiozero import DistanceSensor, MotionSensor  # type: ignore
    GPIOZERO_AVAILABLE = True
    HARDWARE_AVAILABLE = True
except (ImportError, RuntimeError, ModuleNotFoundError):
    DistanceSensor = None
    MotionSensor = None
    GPIOZERO_AVAILABLE = False

try:
    import RPi.GPIO as GPIO  # type: ignore
    RPIGPIO_AVAILABLE = True
    HARDWARE_AVAILABLE = True
except (ImportError, RuntimeError, ModuleNotFoundError):
    GPIO = None
    RPIGPIO_AVAILABLE = False

if not GPIOZERO_AVAILABLE and not RPIGPIO_AVAILABLE:
    HARDWARE_AVAILABLE = False
    logger.warning("Neither gpiozero nor RPi.GPIO detected. Running Edge Collector in simulated telemetry mode.")

AWS_SDK_AVAILABLE = False
mqtt_connection_builder: Any = None
io: Any = None
mqtt: Any = None
try:
    from awsiot import mqtt_connection_builder  # type: ignore
    from awscrt import io, mqtt  # type: ignore
    AWS_SDK_AVAILABLE = True
except (ImportError, ModuleNotFoundError):
    mqtt_connection_builder = None
    io = None
    mqtt = None
    AWS_SDK_AVAILABLE = False
    logger.info("AWS IoT Device SDK not installed. Telemetry will output to local stream/log.")


class GateSensorNode:
    """
    Edge IoT controller deployed at MIT-ADT University Main Campus Gate.
    Continuously monitors barrier clearance distance, entry queue, and vehicle motion frequency
    using dual HC-SR04 ultrasonic sensors and one PIR motion sensor.
    """

    def __init__(self, simulation_mode: bool = False):
        self.simulation_mode = simulation_mode or (not HARDWARE_AVAILABLE)
        self.pir_trigger_count = 0
        self.window_start_time = time.time()
        self.mqtt_connection = None
        self.paho_client = None
        self.aws_iot_connected = False
        self.gpiozero_sensors = {}
        self.latest_payload = None
        self.history = deque(maxlen=60)

        if not self.simulation_mode:
            self._init_gpio()

        # Initialize secure AWS IoT Core mTLS connection
        self._init_aws_iot()

        # Prime initial telemetry payload
        try:
            self.latest_payload = self.calculate_traffic_metrics()
        except Exception:
            self.latest_payload = None

        # Start lightweight local HTTP bridge for TraffiQ App live connection
        self._start_http_server(HTTP_BRIDGE_PORT)

    def _init_aws_iot(self) -> None:
        """Initialize secure TLS connection to AWS IoT Core (ap-south-1)."""
        if not PAHO_AVAILABLE or paho_mqtt is None:
            logger.warning("paho-mqtt library not available. Telemetry will be broadcast locally only.")
            return

        if not (os.path.exists(ROOT_CA_PATH) and os.path.exists(CERTIFICATE_PATH) and os.path.exists(PRIVATE_KEY_PATH)):
            logger.warning(f"AWS IoT certificates missing in {CERT_DIR}. Running in offline mode.")
            return

        try:
            logger.info(f"Connecting to AWS IoT Core endpoint {AWS_IOT_ENDPOINT}:{AWS_IOT_PORT}...")
            try:
                self.paho_client = paho_mqtt.Client(
                    paho_mqtt.CallbackAPIVersion.VERSION2,
                    client_id=DEVICE_CLIENT_ID,
                    protocol=paho_mqtt.MQTTv311
                )
            except (AttributeError, Exception):
                self.paho_client = paho_mqtt.Client(
                    client_id=DEVICE_CLIENT_ID,
                    protocol=paho_mqtt.MQTTv311
                )

            def on_connect(client, userdata, flags, rc, properties=None):
                if rc == 0:
                    self.aws_iot_connected = True
                    logger.info("Successfully connected to AWS IoT Core (ap-south-1 Mumbai) via mTLS!")
                else:
                    self.aws_iot_connected = False
                    logger.warning(f"AWS IoT connection failed with return code: {rc}")

            def on_disconnect(client, userdata, rc, properties=None):
                self.aws_iot_connected = False
                logger.warning(f"Disconnected from AWS IoT Core (code: {rc}). Reconnecting automatically...")

            self.paho_client.on_connect = on_connect
            self.paho_client.on_disconnect = on_disconnect

            self.paho_client.tls_set(
                ca_certs=ROOT_CA_PATH,
                certfile=CERTIFICATE_PATH,
                keyfile=PRIVATE_KEY_PATH,
                cert_reqs=ssl.CERT_REQUIRED,
                tls_version=ssl.PROTOCOL_TLSv1_2
            )

            self.paho_client.connect_async(AWS_IOT_ENDPOINT, AWS_IOT_PORT, keepalive=60)
            self.paho_client.loop_start()
            logger.info("AWS IoT background network loop started.")
        except Exception as exc:
            logger.error(f"Failed to initialize AWS IoT connection: {exc}")
            self.paho_client = None
            self.aws_iot_connected = False

    def _start_http_server(self, port: int = HTTP_BRIDGE_PORT) -> None:
        """Starts a background daemon HTTP server serving /telemetry to TraffiQ App."""
        try:
            TelemetryHTTPHandler.latest_telemetry_getter = lambda *args: self.latest_payload
            TelemetryHTTPHandler.history_getter = lambda *args: list(self.history)
            server = HTTPServer(("0.0.0.0", port), TelemetryHTTPHandler)
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            logger.info(f"Local HTTP Telemetry Bridge listening on http://0.0.0.0:{port}/telemetry")
        except Exception as exc:
            logger.warning(f"Could not start HTTP server on port {port}: {exc}")

    def _init_gpio(self) -> None:
        """Initialize Raspberry Pi GPIO pin mappings (gpiozero or RPi.GPIO)."""
        if GPIOZERO_AVAILABLE and MotionSensor is not None and DistanceSensor is not None:
            try:
                pir = MotionSensor(PIR_GPIO_PIN)
                pir.when_motion = self._on_pir_motion
                u1 = DistanceSensor(echo=ULTRASONIC_1_ECHO_PIN, trigger=ULTRASONIC_1_TRIG_PIN, max_distance=4.0)
                u2 = DistanceSensor(echo=ULTRASONIC_2_ECHO_PIN, trigger=ULTRASONIC_2_TRIG_PIN, max_distance=4.0)
                self.gpiozero_sensors = {"pir": pir, "u1": u1, "u2": u2}
                logger.info("Initialized GPIO via gpiozero: PIR=17, US1=(TRIG:27, ECHO:22), US2=(TRIG:23, ECHO:24)")
                return
            except Exception as exc:
                logger.warning(f"gpiozero init failed ({exc}), attempting RPi.GPIO fallback...")

        if RPIGPIO_AVAILABLE and GPIO is not None:
            try:
                GPIO.setmode(GPIO.BCM)
                GPIO.setwarnings(False)

                # Setup PIR Motion Sensor
                GPIO.setup(PIR_GPIO_PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
                GPIO.add_event_detect(PIR_GPIO_PIN, GPIO.RISING, callback=self._on_pir_motion_channel, bouncetime=200)

                # Setup HC-SR04 Ultrasonic Sensor 1
                GPIO.setup(ULTRASONIC_1_TRIG_PIN, GPIO.OUT)
                GPIO.setup(ULTRASONIC_1_ECHO_PIN, GPIO.IN)
                GPIO.output(ULTRASONIC_1_TRIG_PIN, False)

                # Setup HC-SR04 Ultrasonic Sensor 2
                GPIO.setup(ULTRASONIC_2_TRIG_PIN, GPIO.OUT)
                GPIO.setup(ULTRASONIC_2_ECHO_PIN, GPIO.IN)
                GPIO.output(ULTRASONIC_2_TRIG_PIN, False)

                logger.info("Initialized GPIO via RPi.GPIO: PIR=17, US1=(TRIG:27, ECHO:22), US2=(TRIG:23, ECHO:24)")
            except Exception as exc:
                logger.error(f"Failed to initialize GPIO: {exc}")
                self.simulation_mode = True

    def _on_pir_motion(self) -> None:
        """Callback for gpiozero MotionSensor."""
        self.pir_trigger_count += 1

    def _on_pir_motion_channel(self, channel: int) -> None:
        """Callback for RPi.GPIO interrupt."""
        self.pir_trigger_count += 1

    def _measure_single_pulse(self, trig_pin: int, echo_pin: int) -> Optional[float]:
        """Low-level pulse timing for RPi.GPIO."""
        if GPIO is None:
            return None
        try:
            GPIO.output(trig_pin, True)
            time.sleep(0.00001)
            GPIO.output(trig_pin, False)

            pulse_start = time.time()
            pulse_end = time.time()
            timeout = pulse_start + 0.04

            while GPIO.input(echo_pin) == 0:
                pulse_start = time.time()
                if pulse_start > timeout:
                    return None

            while GPIO.input(echo_pin) == 1:
                pulse_end = time.time()
                if pulse_end > timeout:
                    return None

            pulse_duration = pulse_end - pulse_start
            distance_cm = (pulse_duration * 34300.0) / 2.0
            return round(distance_cm / 100.0, 2)
        except Exception as exc:
            logger.error(f"Pulse measurement error on TRIG {trig_pin}: {exc}")
            return None

    def measure_ultrasonic_distances(self) -> Tuple[Optional[float], Optional[float]]:
        """
        Calculates distances in meters from both HC-SR04 ultrasonic sensors.
        Returns (dist1_m, dist2_m).
        """
        if self.simulation_mode:
            return (round(5.5, 2), round(6.0, 2))

        d1 = None
        d2 = None

        if self.gpiozero_sensors:
            try:
                u1 = self.gpiozero_sensors.get("u1")
                if u1:
                    d1 = round(u1.distance, 2)
            except Exception:
                d1 = None

            try:
                u2 = self.gpiozero_sensors.get("u2")
                if u2:
                    d2 = round(u2.distance, 2)
            except Exception:
                d2 = None

            return d1, d2

        if RPIGPIO_AVAILABLE:
            d1 = self._measure_single_pulse(ULTRASONIC_1_TRIG_PIN, ULTRASONIC_1_ECHO_PIN)
            time.sleep(0.04)  # Prevent cross-talk echo between sensors
            d2 = self._measure_single_pulse(ULTRASONIC_2_TRIG_PIN, ULTRASONIC_2_ECHO_PIN)
            return d1, d2

        return None, None

    def measure_ultrasonic_distance(self) -> Optional[float]:
        """Backward-compatible distance getter (returns primary or nearest distance)."""
        d1, d2 = self.measure_ultrasonic_distances()
        valid = [d for d in (d1, d2) if d is not None]
        return min(valid) if valid else None

    def calculate_traffic_metrics(self) -> Dict[str, Any]:
        """
        Evaluates sliding 60-second window metrics and derives truthful telemetry.
        """
        now = time.time()
        elapsed = max(now - self.window_start_time, 1.0)
        # Normalize triggers to 60-second equivalent
        triggers_per_min = int((self.pir_trigger_count / elapsed) * 60)

        # Reset sliding window
        self.pir_trigger_count = 0
        self.window_start_time = now

        d1, d2 = self.measure_ultrasonic_distances()
        valid_distances = [d for d in (d1, d2) if d is not None]
        measured_dist = min(valid_distances) if valid_distances else None

        # Severity categorization heuristic based on honest sensor measurements
        if measured_dist is None and not self.simulation_mode:
            traffic_level = "Sensor Offline"
            motion_activity = "None"
        elif (measured_dist is not None and measured_dist < 2.0) or triggers_per_min > 18:
            traffic_level = "Heavy Traffic"
            motion_activity = "High"
        elif (measured_dist is not None and measured_dist < 4.0) or triggers_per_min > 8:
            traffic_level = "Moderate Traffic"
            motion_activity = "Moderate"
        else:
            traffic_level = "Low Traffic"
            motion_activity = "Low"

        payload = {
            "version": "1.0.0",
            "institution": "MIT Art, Design and Technology University, Pune",
            "campus": "Rajbaug Campus, Loni Kalbhor",
            "gateId": "main",
            "gateName": "Main Campus Gate",
            "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "telemetry": {
                "trafficLevel": traffic_level,
                "motionActivity": motion_activity,
                "pirTriggersPerMin": triggers_per_min,
                "measuredDistance": f"{measured_dist:.1f} m" if measured_dist is not None else "--",
                "ultrasonic1Distance": f"{d1:.1f} m" if d1 is not None else "--",
                "ultrasonic2Distance": f"{d2:.1f} m" if d2 is not None else "--",
                "pirStatus": "online" if not self.simulation_mode else "demo",
                "ultrasonicStatus": "online" if measured_dist is not None else "offline",
                "nodeHealth": "operational"
            },
            "edgeHardware": {
                "nodeModel": "Raspberry Pi 3 Model B+",
                "gpioMapping": {
                    "pir": PIR_GPIO_PIN,
                    "ultrasonic1_trig": ULTRASONIC_1_TRIG_PIN,
                    "ultrasonic1_echo": ULTRASONIC_1_ECHO_PIN,
                    "ultrasonic2_trig": ULTRASONIC_2_TRIG_PIN,
                    "ultrasonic2_echo": ULTRASONIC_2_ECHO_PIN
                },
                "simulated": self.simulation_mode
            }
        }

        # Record actual historical telemetry point
        now_dt = datetime.now()
        hist_entry = {
            "time": now_dt.strftime("%H:%M:%S"),
            "displayTime": now_dt.strftime("%I:%M:%S %p"),
            "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "distance": round(measured_dist, 2) if measured_dist is not None else 0.0,
            "u1Distance": round(d1, 2) if d1 is not None else 0.0,
            "u2Distance": round(d2, 2) if d2 is not None else 0.0,
            "trafficLevel": traffic_level,
            "delayMins": 12 if traffic_level == "Heavy Traffic" else 5 if traffic_level == "Moderate Traffic" else 1,
            "flow": "Heavy Queue" if traffic_level == "Heavy Traffic" else "Moderate Flow" if traffic_level == "Moderate Traffic" else "Free Flow",
            "pirTriggers": triggers_per_min,
            "motionActivity": motion_activity
        }
        self.history.append(hist_entry)
        payload["history"] = list(self.history)

        self.latest_payload = payload
        return payload

    def publish_telemetry(self, payload: Dict[str, Any]) -> None:
        """Dispatches telemetry JSON to AWS IoT Core MQTT topic."""
        message_json = json.dumps(payload, indent=2)
        if self.paho_client and self.aws_iot_connected:
            try:
                self.paho_client.publish(
                    topic=AWS_IOT_TOPIC,
                    payload=message_json,
                    qos=1
                )
                logger.info(f"Published telemetry to AWS IoT topic [{AWS_IOT_TOPIC}]")
            except Exception as exc:
                logger.error(f"Paho MQTT publish failed: {exc}")
        elif self.mqtt_connection and AWS_SDK_AVAILABLE and mqtt is not None:
            try:
                self.mqtt_connection.publish(
                    topic=AWS_IOT_TOPIC,
                    payload=message_json,
                    qos=mqtt.QoS.AT_LEAST_ONCE
                )
                logger.info(f"Published telemetry to AWS IoT topic [{AWS_IOT_TOPIC}]")
            except Exception as exc:
                logger.error(f"MQTT publish failed: {exc}")
        else:
            logger.info(f"[TELEMETRY EMIT] Topic: {AWS_IOT_TOPIC}\n{message_json}")

    def cleanup(self) -> None:
        """Release hardware GPIO resources and MQTT connection cleanly."""
        if self.paho_client:
            try:
                self.paho_client.loop_stop()
                self.paho_client.disconnect()
                logger.info("AWS IoT client disconnected cleanly.")
            except Exception:
                pass

        if self.gpiozero_sensors:
            for s in self.gpiozero_sensors.values():
                try:
                    s.close()
                except Exception:
                    pass
            logger.info("gpiozero sensor devices cleanly closed.")

        if RPIGPIO_AVAILABLE and not self.simulation_mode and HARDWARE_AVAILABLE and GPIO is not None:
            try:
                GPIO.cleanup()
                logger.info("RPi.GPIO resources cleanly released.")
            except Exception:
                pass


if __name__ == "__main__":
    logger.info("Starting TraffiQ Edge Sensor Node...")
    node = GateSensorNode()
    try:
        while True:
            # Poll every 2 seconds for fresh live telemetry
            time.sleep(2)
            telemetry = node.calculate_traffic_metrics()
            node.publish_telemetry(telemetry)
    except KeyboardInterrupt:
        logger.info("Shutdown signal received.")
    finally:
        node.cleanup()
