#!/usr/bin/env python3
"""
TraffiQ - Dual Ultrasonic (HC-SR04) + PIR Motion Sensor Diagnostic Test
MIT Art, Design and Technology University, Pune
----------------------------------------------------------------------
This diagnostic script tests your 2 HC-SR04 Ultrasonic sensors and 1 PIR sensor.

Default Pin Configuration (BCM numbering):
  - PIR Motion Sensor:       GPIO 17 (Pin 11)
  - Ultrasonic Sensor 1:     TRIG = GPIO 27 (Pin 13), ECHO = GPIO 22 (Pin 15)
  - Ultrasonic Sensor 2:     TRIG = GPIO 23 (Pin 16), ECHO = GPIO 24 (Pin 18)

IMPORTANT ELECTRICAL SAFETY NOTICE:
  HC-SR04 ECHO pins output 5V! Raspberry Pi GPIOs are 3.3V ONLY!
  Always use a voltage divider (e.g., 1k ohm + 2k ohm) on ECHO pins
  to prevent damaging the Raspberry Pi 3B+ GPIO inputs.
"""

import sys
import time
import argparse

# Try importing gpiozero (recommended for Bookworm) or fallback to RPi.GPIO
USE_GPIOZERO = False
USE_RPIGPIO = False

try:
    from gpiozero import DistanceSensor, MotionSensor
    USE_GPIOZERO = True
except ImportError:
    try:
        import RPi.GPIO as GPIO
        USE_RPIGPIO = True
    except ImportError:
        pass

def parse_args():
    parser = argparse.ArgumentParser(description="TraffiQ Hardware Sensor Verification")
    parser.add_argument("--pir", type=int, default=17, help="BCM GPIO pin for PIR motion sensor (default: 17)")
    parser.add_argument("--trig1", type=int, default=27, help="BCM GPIO pin for Ultrasonic 1 TRIG (default: 27)")
    parser.add_argument("--echo1", type=int, default=22, help="BCM GPIO pin for Ultrasonic 1 ECHO (default: 22)")
    parser.add_argument("--trig2", type=int, default=23, help="BCM GPIO pin for Ultrasonic 2 TRIG (default: 23)")
    parser.add_argument("--echo2", type=int, default=24, help="BCM GPIO pin for Ultrasonic 2 ECHO (default: 24)")
    return parser.parse_args()

def measure_rpi_gpio_distance(trig_pin, echo_pin, timeout=0.04):
    """Fallback ultrasonic measurement using RPi.GPIO."""
    GPIO.output(trig_pin, True)
    time.sleep(0.00001)  # 10us pulse
    GPIO.output(trig_pin, False)

    start_time = time.time()
    stop_time = time.time()
    deadline = start_time + timeout

    while GPIO.input(echo_pin) == 0:
        start_time = time.time()
        if start_time > deadline:
            return None

    while GPIO.input(echo_pin) == 1:
        stop_time = time.time()
        if stop_time > deadline:
            return None

    elapsed = stop_time - start_time
    # Distance in cm = (elapsed * 34300) / 2
    dist_cm = (elapsed * 34300.0) / 2.0
    return round(dist_cm, 1)

def run_diagnostics(args):
    print("=" * 65)
    print("  TraffiQ Hardware Verification: 2 Ultrasonic + 1 PIR Sensor")
    print("  MIT-ADT Campus Smart Traffic & Gate System")
    print("=" * 65)
    print(f"  PIR Pin:          BCM GPIO {args.pir}")
    print(f"  Ultrasonic 1:     TRIG = GPIO {args.trig1}, ECHO = GPIO {args.echo1}")
    print(f"  Ultrasonic 2:     TRIG = GPIO {args.trig2}, ECHO = GPIO {args.echo2}")
    print("=" * 65)

    if not USE_GPIOZERO and not USE_RPIGPIO:
        print("\n[ERROR] Neither 'gpiozero' nor 'RPi.GPIO' is installed.")
        print("Please install gpiozero using:")
        print("    sudo apt update && sudo apt install -y python3-gpiozero python3-lgpio")
        sys.exit(1)

    if USE_GPIOZERO:
        print("[INFO] Using modern 'gpiozero' backend (optimal for Bookworm).")
        try:
            pir_sensor = MotionSensor(args.pir)
            # max_distance=4.0m
            ultra1 = DistanceSensor(echo=args.echo1, trigger=args.trig1, max_distance=4.0)
            ultra2 = DistanceSensor(echo=args.echo2, trigger=args.trig2, max_distance=4.0)
        except Exception as e:
            print(f"[ERROR] Failed initializing gpiozero sensors: {e}")
            sys.exit(1)

        print("\nPress Ctrl+C to stop.\n")
        print(f"{'TIME':<10} | {'PIR MOTION':<14} | {'ULTRASONIC 1':<16} | {'ULTRASONIC 2':<16}")
        print("-" * 65)

        try:
            while True:
                timestamp = time.strftime("%H:%M:%S")
                pir_state = "MOTION DETECTED" if pir_sensor.motion_detected else "Idle (Clear)"

                try:
                    d1_cm = round(ultra1.distance * 100, 1)
                    d1_str = f"{d1_cm:.1f} cm ({ultra1.distance:.2f} m)"
                except Exception:
                    d1_str = "Timeout/Error"

                try:
                    d2_cm = round(ultra2.distance * 100, 1)
                    d2_str = f"{d2_cm:.1f} cm ({ultra2.distance:.2f} m)"
                except Exception:
                    d2_str = "Timeout/Error"

                print(f"{timestamp:<10} | {pir_state:<14} | {d1_str:<16} | {d2_str:<16}")
                time.sleep(1.0)
        except KeyboardInterrupt:
            print("\nTest completed successfully. Sensor monitoring stopped.")

    elif USE_RPIGPIO:
        print("[INFO] Using legacy 'RPi.GPIO' backend.")
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)

        GPIO.setup(args.pir, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
        GPIO.setup(args.trig1, GPIO.OUT)
        GPIO.setup(args.echo1, GPIO.IN)
        GPIO.setup(args.trig2, GPIO.OUT)
        GPIO.setup(args.echo2, GPIO.IN)

        GPIO.output(args.trig1, False)
        GPIO.output(args.trig2, False)
        time.sleep(0.5)

        print("\nPress Ctrl+C to stop.\n")
        print(f"{'TIME':<10} | {'PIR MOTION':<14} | {'ULTRASONIC 1':<16} | {'ULTRASONIC 2':<16}")
        print("-" * 65)

        try:
            while True:
                timestamp = time.strftime("%H:%M:%S")
                pir_active = GPIO.input(args.pir) == 1
                pir_state = "MOTION DETECTED" if pir_active else "Idle (Clear)"

                d1 = measure_rpi_gpio_distance(args.trig1, args.echo1)
                d1_str = f"{d1:.1f} cm ({d1/100:.2f} m)" if d1 is not None else "Timeout/Error"

                time.sleep(0.05)  # brief pause between ultrasonic pings to avoid echo cross-talk

                d2 = measure_rpi_gpio_distance(args.trig2, args.echo2)
                d2_str = f"{d2:.1f} cm ({d2/100:.2f} m)" if d2 is not None else "Timeout/Error"

                print(f"{timestamp:<10} | {pir_state:<14} | {d1_str:<16} | {d2_str:<16}")
                time.sleep(1.0)
        except KeyboardInterrupt:
            print("\nTest completed successfully. Sensor monitoring stopped.")
        finally:
            GPIO.cleanup()

if __name__ == "__main__":
    args = parse_args()
    run_diagnostics(args)