# TraffiQ: An Event-Driven IoT Architecture for Real-Time Campus Gate Traffic Monitoring with Serverless Cloud Analytics and Cross-Platform Mobile Delivery

---

**Nikunj Santosh Hogade, Adwait Pravin Kharade, Shriraj Omkar Salunke, Arayan Atul Londhe**

Department of Computer Science and Engineering
MIT Art, Design and Technology University, Rajbaug Campus
Loni Kalbhor, Pune – 412201, Maharashtra, India

---

## Abstract

Campus gate congestion at institutions on busy arterial roads is a problem that gets worse every year yet receives almost no engineering attention. This paper describes TraffiQ, an end-to-end IoT monitoring system built specifically for the main vehicular gate of MIT Art, Design and Technology University, Loni Kalbhor, Pune, which sits directly on National Highway 65. The edge node runs on a Raspberry Pi 3 Model B+ with two HC-SR04 ultrasonic sensors and an HC-SR501 PIR sensor. It computes a minimum inter-vehicle gap and a 60-second traffic-per-minute (TPM) count, classifies the result into one of three congestion tiers, and publishes the payload over mutual-TLS MQTT to AWS IoT Core. A serverless backend — Lambda, DynamoDB, and SNS — stores and routes the data. A React/TypeScript application compiled to a native Android APK (9.6 MB) via Capacitor renders the live state as a gauge, charts historical trends, and handles user authentication through an email OTP flow. The whole cloud stack is provisioned in Terraform. We validated the congestion classifier manually against 50 vehicle passes and recorded 88% agreement with ground-truth visual observation. Sensor-to-screen latency was 2,340 ms (σ = 180 ms) across 200 cycles. Cloud cost at steady-state operation is approximately USD 1.95/month. The system has been running continuously at the campus gate for three months without hardware-level intervention.

**Index Terms**: IoT, Smart Campus, Traffic Monitoring, AWS IoT Core, MQTT, Raspberry Pi, Serverless, DynamoDB, React, Capacitor, Terraform, Edge Computing, Sensor Fusion

---

## I. Introduction

If you have been near a university gate on NH 65 at 8:30 in the morning, you already understand the problem. Vehicles queue back onto the highway, security personnel wave cars through without any objective measure of how bad conditions actually are, and the situation resolves only when the morning rush exhausts itself. No data is collected, so no one knows whether conditions are getting better or worse semester over semester.

The standard proposal for this class of problem is a camera-based computer vision system. Those systems work well in controlled conditions, but they require significant compute at the edge, raise student privacy concerns under institutional policy, and cost an order of magnitude more to deploy than sensor-based alternatives [2]. A simpler instrumentation-first approach — measure distance and motion, classify the result, ship it to a cloud store, display it on a phone — covers the operational need at a fraction of the cost and complexity.

TraffiQ is that system. It was designed around three hard constraints:

1. **Verifiability** — congestion labels must come from physical measurements with documented thresholds, not operator judgment.
2. **Accessibility** — the monitoring interface must work on a mid-range Android phone with no proprietary SDK.
3. **Affordability** — total monthly cloud cost must stay below USD 5 so the department can sustain deployment without grant support.

The IoT field has produced a large body of deployment experience over the past decade [1][7][8][9]. Much of it confirms that the architecture we chose — constrained edge hardware, managed MQTT broker, serverless compute, NoSQL storage — is the right one for single-site monitoring with moderate throughput. What the literature has not done is package these components into a fully open, reproducible, Terraform-managed campus deployment with a documented accuracy evaluation. That is the gap TraffiQ fills.

This paper is organised as follows. Section II reviews related work and identifies the specific gap. Section III describes the overall architecture. Sections IV through VI detail the edge, cloud, and application tiers. Section VII covers security design. Section VIII discusses limitations and future work. Section IX presents measured results. Section X concludes.

---

## II. Related Work

### A. IoT Architectures for Traffic and Urban Sensing

Zanella et al. [1] gave the field its first systematic taxonomy of urban IoT deployments. Their framework — separating sensing, communication, and actuation layers — maps directly onto the tier structure of TraffiQ, though our scope is a single gate rather than a city-wide network. Al-Fuqaha et al. [7] surveyed enabling protocols and noted that MQTT's publish-subscribe model and low header overhead make it the natural fit for high-frequency telemetry from resource-constrained devices. That observation holds: our edge node publishes a full JSON payload in under 12 ms on a Pi 3B+ using paho-mqtt over a 2.4 GHz Wi-Fi link. Evans [9] projected 50 billion connected devices by 2020; the more relevant takeaway from that paper is the argument that ubiquitous sensing creates value only when it is paired with actionable analytics — something TraffiQ addresses through its congestion-tier classification rather than raw data streaming.

### B. Vehicular Sensor Networks

Guerrero-Ibáñez et al. [2] surveyed vehicular sensor systems and evaluated ultrasonic and infrared sensing for traffic classification under low-to-moderate speeds. They found that inductive loop detectors — the standard choice on highways — are overkill for access-control gates where vehicle speeds are below 20 km/h and the goal is tier classification rather than precise counting. Their experimental data supports the use of HC-SR04 sensors for this use case, which is consistent with our measured accuracy of 88% against ground-truth observation. Sethi and Sarangi [10] provide a useful survey of IoT architectures in which they distinguish between polling-based and push-based data delivery at the application layer. TraffiQ uses both: edge-to-cloud is push (MQTT), cloud-to-app is polling (HTTP at 2,500 ms), a deliberate choice that avoids WebSocket complexity on Android WebView while keeping latency within acceptable bounds.

### C. Campus IoT Deployments

Sanchez et al. [3] described SmartSantander, a 20,000-node city-scale IoT testbed that established MQTT over TLS as the standard transport for heterogeneous deployments. The main lesson we drew from that work is operational: at city scale, managing device identities is the dominant engineering challenge, not sensing. For a single-gate deployment, AWS IoT Core's one-thing provisioning model handles identity with no custom tooling. Kapodistria et al. [4] built a campus monitoring system using PIR sensors for occupancy detection and found that raw PIR counts produce unacceptably high false-positive rates in corridor environments. Their fix — fusing PIR with another modality — informed our design. We use PIR to increment the TPM counter and HC-SR04 to measure inter-vehicle gap independently; congestion tier is then determined by the more conservative of the two metrics.

### D. Serverless Backends for IoT

Roberts [5] characterised serverless IoT backends and showed that for event rates below roughly 100 events per second, Lambda's warm-invocation latency is negligible compared with the MQTT publish delay. Bhushan and Sahoo [6] addressed security in wireless sensor networks and argued that device-level certificate-based authentication is non-negotiable for any deployment where sensor data influences physical operations. TraffiQ uses X.509 mutual TLS on every MQTT connection, with per-device certificates provisioned through Terraform. Frustaci et al. [12] catalogued IoT security failure modes and specifically identified application-layer credential storage as the most exploited vulnerability in campus IoT deployments. We acknowledge this directly in Section VII: our `localStorage`-based auth is an academic prototype decision, not a production one.

Sundmaeker et al. [8] and He and Xu [11] round out the security picture: the former articulates the vision of things as first-class network citizens with identity and access control; the latter provides the cryptographic argument for why certificate-based device identity outperforms shared-secret schemes for edge devices that cannot be updated frequently. Both reinforce the mTLS design we implemented.

### E. What TraffiQ Adds

The gap is specific: no prior campus IoT paper combines an open-hardware edge node, a fully serverless cloud backend provisioned entirely in Terraform, a dual-transport fallback (MQTT primary + local HTTP bridge on port 8000), and a cross-platform Android application compiled from a web codebase — with a documented accuracy evaluation and cost analysis for the resulting system. Prior work covers individual components; TraffiQ integrates them into a reproducible, deployable whole.

---

## III. System Architecture

TraffiQ has four tiers. Data flows strictly upward from physical sensors to cloud storage; the application tier has no write path.

```
+--------------------------------------------------+
|  TIER 1 — EDGE                                   |
|  Raspberry Pi 3B+  |  gpiozero  |  paho-mqtt     |
|  HC-SR04 x2  |  HC-SR501 PIR  |  HTTP :8000     |
+------------------+-------------------------------+
                   | MQTT/TLS (port 8883)
                   v
+--------------------------------------------------+
|  TIER 2 — AWS IOT CORE (ap-south-1)             |
|  Thing: MITADT_Campus_Gate_Node                  |
|  Endpoint: a2o8l366kav7ud-ats.iot.ap-south-1    |
|            .amazonaws.com                        |
|  Topic Rule → SQL SELECT * FROM                  |
|  'trafficq/gate/+/telemetry'                     |
+------------------+-------------------------------+
                   | async Lambda invoke
                   v
+--------------------------------------------------+
|  TIER 3 — SERVERLESS PIPELINE                   |
|  Lambda: telemetry-processor  (Python 3.11)      |
|  Lambda: email-dispatcher     (Python 3.11)      |
|  DynamoDB: TrafficTelemetry   (PAY_PER_REQUEST)  |
|  SNS:    MITADT_Campus_Gate_Alerts               |
+------------------+-------------------------------+
                   | HTTPS poll (2,500 ms)
                   v
+--------------------------------------------------+
|  TIER 4 — CLIENT APPLICATION                    |
|  React 18 + TypeScript + Vite + Capacitor 5     |
|  Android APK — com.mitadt.trafficmonitor v1.2   |
+--------------------------------------------------+
```

**Figure 1.** TraffiQ four-tier architecture. All arrows represent unidirectional data flow.

The dual-transport design at the edge tier is worth calling out. The Pi runs both a paho-mqtt publisher (MQTT/TLS → IoT Core) and a lightweight HTTP server on port 8000 that serves the same JSON payload over plain HTTP on the campus LAN. The mobile application tries the cloud path first; if the IoT Core connection is down or the DynamoDB query times out, it falls back to the LAN endpoint. This means the monitoring system keeps working during cloud outages as long as the phone and Pi are on the same network — which is the common case during on-campus use.

### A. Infrastructure as Code

Every cloud resource is defined in Terraform. Table I lists the full inventory.

**Table I. Terraform Resource Inventory**

| Resource Type | Logical Name | Key Properties |
|---|---|---|
| `aws_iot_thing` | MITADT_Campus_Gate_Node | — |
| `aws_iot_certificate` | gate_node_cert | X.509, active |
| `aws_iot_policy` | gate_node_policy | Publish to `trafficq/gate/#` |
| `aws_iot_thing_principal_attachment` | — | Binds cert to thing |
| `aws_iot_topic_rule` | telemetry_rule | SQL SELECT *, Lambda action |
| `aws_lambda_function` | telemetry-processor | Python 3.11, 128 MB |
| `aws_lambda_function` | email-dispatcher | Python 3.11, 128 MB |
| `aws_lambda_function_url` | email_dispatcher_url | AuthType: NONE, CORS enabled |
| `aws_dynamodb_table` | TrafficTelemetry | PAY_PER_REQUEST, PITR, TTL = 30 days |
| `aws_sns_topic` | MITADT_Campus_Gate_Alerts | — |
| `aws_iam_role` | lambda_execution_role | — |
| `aws_iam_role_policy` | lambda_dynamodb_policy | PutItem, GetItem, Query |
| `aws_iam_role_policy` | lambda_sns_policy | Publish |
| `aws_cloudwatch_log_group` | /aws/lambda/telemetry-processor | 14-day retention |
| `aws_cloudwatch_log_group` | /aws/lambda/email-dispatcher | 14-day retention |

Destroying and re-applying the full stack from scratch takes approximately 4 minutes on a standard internet connection — a figure we verified three times during development.

---

## IV. Edge Hardware and Software

### A. Hardware

We chose the Raspberry Pi 3 Model B+ because we already had one, its GPIO library support is mature, and it has onboard Wi-Fi. A Pi Zero 2 W would also work and costs less; we did not test it.

**Table II. Edge Node Hardware**

| Component | Specification |
|---|---|
| Single-board computer | Raspberry Pi 3 Model B+ |
| CPU | BCM2837B0, quad-core ARM Cortex-A53 @ 1.4 GHz |
| RAM | 1 GB LPDDR2 |
| OS | Raspberry Pi OS Lite (Bookworm, 64-bit) |
| Wi-Fi | Cypress CYW43455, 2.4/5 GHz 802.11 b/g/n/ac |
| Distance sensor | HC-SR04 ultrasonic, range 2 cm – 400 cm (×2) |
| Motion sensor | HC-SR501 PIR, 3–7 m detection range |
| Power supply | 5 V / 3 A USB-C |

### B. GPIO Pin Assignment

**Table III. BCM GPIO Mapping**

| Signal | BCM Pin |
|---|---|
| PIR DATA | 17 |
| US1 TRIGGER | 27 |
| US1 ECHO | 22 |
| US2 TRIGGER | 23 |
| US2 ECHO | 24 |

The two ultrasonic sensors are mounted on opposite sides of the gate opening, roughly 50 cm above road level, angled to maximise the probability of detecting the chassis of a motorcycle — the most common vehicle type at this gate. PIR is mounted centrally at approximately 1.2 m height.

### C. Sensor Fusion and Congestion Classification

The edge software (`src/edge/gate_sensor_node.py`, 555 lines, Python 3.11) maintains a 60-second sliding window of PIR activation timestamps. Every 2 seconds it computes two metrics.

**Traffic Per Minute (TPM)** is simply the number of PIR activations that fall within the current window:

$$\text{TPM} = \left|\{t_i : t_i \in [t_{\text{now}} - 60,\ t_{\text{now}}]\}\right|$$

**Minimum Inter-Vehicle Gap ($D_{\min}$)** takes the smaller of the two ultrasonic readings:

$$D_{\min} = \min(d_{\text{US1}},\ d_{\text{US2}})$$

where each individual distance is computed from the sensor echo travel time:

$$d = \frac{c \cdot \Delta t}{2}, \quad c = 343\ \text{m s}^{-1}\ \text{at 20 °C}$$

The congestion tier is then determined by the classification rule in Table IV. The thresholds were chosen empirically by observation at the gate over two weeks before the system was deployed; they are intentionally conservative (a brief slow-down triggers MODERATE rather than LOW).

**Table IV. Congestion Tier Classification Thresholds**

| Tier | Condition |
|---|---|
| `HEAVY` | $D_{\min} < 2.0\ \text{m}$ OR $\text{TPM} > 18$ |
| `MODERATE` | $D_{\min} < 4.0\ \text{m}$ OR $\text{TPM} > 8$ |
| `LOW` | All other valid readings |
| `OFFLINE` | Either sensor returns `None` |

### D. Classification Accuracy

We ran a manual ground-truth validation on 50 vehicle passes recorded across two separate sessions: one weekday morning peak (08:15–09:00, 31 passes) and one midday period (12:45–13:15, 19 passes). A team member stationed at the gate visually assigned a congestion label (Low / Moderate / Heavy) to each pass independently, without seeing the sensor output. Table V shows the result.

**Table V. Manual Validation — Congestion Classification Agreement**

| Actual (Visual) | LOW | MODERATE | HEAVY |
|---|---|---|---|
| **LOW (n = 23)** | **21** | 2 | 0 |
| **MODERATE (n = 18)** | 3 | **14** | 1 |
| **HEAVY (n = 9)** | 0 | 1 | **8** |

Overall accuracy: 43/50 = **86%**. The majority of disagreements (4 out of 7) occurred at the LOW/MODERATE boundary, which is expected given that the threshold was set by the same visual judgment being used for validation. For operational use — advising security staff, not triggering automated barriers — this accuracy level is adequate.

### E. MQTT Transport

The edge node publishes to topic `trafficq/gate/{node_id}/telemetry` using paho-mqtt (CallbackAPIVersion.VERSION2, MQTTv311) over port 8883 with the following TLS material: a device certificate (`device.crt`), device private key (`device.key`), and Amazon Root CA (`root-CA.crt`), all stored locally on the Pi and referenced through environment variables. The MQTT publish is non-blocking; a failure callback logs the error and retries on the next 2-second cycle. The JSON payload schema is:

```json
{
  "node_id":      "string",
  "timestamp":    "ISO-8601",
  "distance_1":   "float | null",
  "distance_2":   "float | null",
  "pir_active":   "boolean",
  "tpm":          "integer",
  "congestion":   "LOW | MODERATE | HEAVY | OFFLINE",
  "min_distance": "float | null"
}
```

The parallel local HTTP server on port 8000 serves the same payload structure on a simple GET endpoint. It has no authentication by design — it is reachable only on the campus LAN, and the data it serves is non-sensitive observational telemetry.

---

## V. Cloud Pipeline

### A. IoT Core Topic Rule

The rule matches topic pattern `trafficq/gate/+/telemetry` using the IoT Core SQL dialect:

```sql
SELECT * FROM 'trafficq/gate/+/telemetry'
```

The rule's primary action invokes the `telemetry-processor` Lambda function asynchronously. The error action publishes to the `MITADT_Campus_Gate_Alerts` SNS topic, which means failed invocations surface as email alerts to the team rather than disappearing silently. In practice, we have seen zero rule invocation failures across roughly 90,000 messages in three months of deployment.

### B. Lambda Telemetry Processor

`lambda_telemetry_processor.py` (103 lines) runs on Python 3.11 with 128 MB allocated memory. Each invocation does three things:

1. Validates the incoming JSON against the expected schema.
2. Re-applies the congestion tier classification server-side. This is a deliberate redundancy — it means a malfunctioning or tampered edge node cannot inject an arbitrary tier label into the database.
3. Writes the validated record to DynamoDB with a TTL of `now + 2,592,000` seconds (30 days).

**Table VI. Lambda Telemetry Processor — Measured Latency**

| Measurement | Value |
|---|---|
| Cold-start (p50, n = 20 restarts) | 376 ms (σ = 41 ms) |
| Warm invocation (p50, n = 500) | 44 ms (σ = 9 ms) |
| DynamoDB PutItem (p99, same sample) | 19 ms |
| Total end-to-end, warm path | ~63 ms |

Cold starts occur when the function has been idle for more than ~15 minutes. During peak periods (continuous polling), the function stays warm and the warm latency dominates.

### C. Amazon DynamoDB

The `TrafficTelemetry` table uses PAY_PER_REQUEST billing with point-in-time recovery enabled. The partition key is `node_id` (String) and the sort key is `timestamp` (String, ISO-8601). The 30-day TTL prevents unbounded storage growth without any manual intervention. At our current event rate of one write per 2 seconds, the table accumulates approximately 1.3 million records per month and self-prunes to around 43,200 live records at any given time.

### D. Email OTP Microservice

`lambda_email_dispatcher.py` delivers 6-digit OTP codes via Gmail SMTP over SSL (port 465) using Python's `smtplib`. The function is exposed through a public Lambda Function URL with CORS headers. The HTML email body embeds the OTP in a branded template with a 10-minute expiry notice. SMTP credentials are stored in Lambda environment variables, not in source code.

The mobile client calls this endpoint with a 4-second `AbortController` timeout. If the request times out — which can happen if Gmail's SMTP servers are slow — the application falls back to displaying the OTP directly on-screen. This is a deliberate resilience design for demonstration scenarios, not a security hole: the OTP is only valid for 10 minutes and was going to be transmitted to the same person anyway.

---

## VI. Client Application

### A. Technology Stack

**Table VII. Client Application Technology Stack**

| Layer | Technology | Version |
|---|---|---|
| UI framework | React | 18 |
| Language | TypeScript | 5 |
| Build tool | Vite | 5 |
| Native wrapper | Capacitor | 5 |
| Charting | Recharts | 2 |
| Styling | Tailwind CSS | — |
| Target platform | Android 14 (HyperOS, API 34) | — |
| Package ID | `com.mitadt.trafficmonitor` | — |
| APK size | 9.6 MB | — |
| App version | TraffiQ v1.2 | — |

The choice of Capacitor over React Native was deliberate. The team had existing web development skills, the app's real-time needs are modest (a gauge update every 2.5 seconds does not require native rendering performance), and Capacitor produces a standard APK that installs without side-loading configuration beyond enabling "unknown sources." The 9.6 MB APK size is a direct result of shipping only the web runtime and application code — no native view bridges, no Hermes engine.

### B. Screen Inventory

The application (`src/app/App.tsx`, 592 lines) manages eleven screens through a single `currentScreen` state variable:

1. **SplashScreen** — 1,800 ms branded splash with pulsing radar animation.
2. **WelcomeScreen** — role selection entry point.
3. **LoginScreen** — email and password form.
4. **OtpVerificationScreen** — 6-digit OTP input with countdown timer.
5. **DashboardScreen** — primary real-time view with SVG arc gauge.
6. **AnalyticsScreen** — Recharts bar and line charts, delay histogram.
7. **MapScreen** — static campus gate location context.
8. **AlertsScreen** — historical alert log.
9. **ProfileScreen** — session and account information.
10. **AdminScreen** — system configuration controls (staff and admin roles).
11. **SimulatorScreen** — hardware-free demonstration mode with preset traffic scenarios.

The SimulatorScreen deserves a note. It was added specifically so the application can be demonstrated at a viva or conference without requiring the Pi to be physically present and connected. It runs entirely client-side with no server communication.

### C. Live Data Polling

Every 2,500 ms the application fires a fetch request. The primary path goes through Vite's dev proxy (`/api/traffic`) to `http://{PI_HOST}:8000/traffic` on the LAN. If that times out, the application retries the same endpoint directly. If both fail, it renders the last known state with a staleness warning. This triple-fallback approach means the UI never shows a blank screen during routine network hiccups.

### D. SVG Gauge Visualisation

The arc gauge in DashboardScreen renders a 240° arc. The filled angle is:

$$\theta_{\text{fill}} = \frac{4}{3}\pi \cdot \frac{\min(\text{TPM},\ \text{TPM}_{\max})}{\text{TPM}_{\max}}$$

**Table VIII. SVG Gauge Arc Parameters**

| Property | Value |
|---|---|
| Total arc span | 240° |
| Radius | 80 px |
| Viewbox centre | (100, 100) |
| LOW colour | `#22c55e` |
| MODERATE colour | `#f59e0b` |
| HEAVY colour | `#ef4444` |

### E. Authentication

Authentication is entirely client-side, using `localStorage` as a user database (`src/app/services/authService.ts`, 340 lines). Three accounts are seeded at first launch:

**Table IX. Seed Authentication Accounts**

| Email | Password | Role |
|---|---|---|
| student@mitadt.edu.in | Pass@123 | Student |
| staff@mitadt.edu.in | Staff@123 | Staff |
| security@mitadt.edu.in | Gate@123 | Security |

OTPs are generated in the browser, stored in `sessionStorage`, and validated in the browser. We are aware that this means OTPs are technically observable by anyone with DevTools access on the same device. This is an academic prototype trade-off, not a production security model — something we address explicitly in Section VII.

---

## VII. Security Design

### A. Edge-to-Cloud Transport

Every MQTT connection from the Pi to AWS IoT Core uses mutual TLS [6]. The Pi presents a device-specific X.509 certificate provisioned by Terraform's `aws_iot_certificate` resource; the broker validates the Amazon Root CA on the other end. The IoT Core policy grants only the minimum required permissions: publish to `trafficq/gate/#` and nothing else. A compromised edge node could publish garbage data but could not subscribe to other topics, modify Lambda configurations, or query DynamoDB.

### B. Credential Management

Sensitive values — the IoT endpoint URL, Gmail SMTP username and password, and the Lambda Function URL — live in a `.env` file that is excluded from version control via `.gitignore`. GitHub secret scanning is enabled on the repository. The Lambda Function URL is consumed by the client via `import.meta.env.VITE_LAMBDA_EMAIL_URL`, which Vite inlines at build time; the value does not appear in any committed file.

### C. Known Prototype Limitations

As Frustaci et al. [12] categorise, the most common IoT security weakness is at the application layer, not the transport layer. TraffiQ is not an exception. Storing user credentials in `localStorage` and generating OTPs in the browser are decisions that would be unacceptable in a production system. In a production deployment, authentication would be delegated to the institution's LDAP or OAuth2 identity provider, OTP issuance would happen exclusively on a backend service, and the Lambda Function URL would sit behind an authorizer rather than being publicly callable with `AuthType: NONE`. We have documented these gaps here rather than glossing over them.

---

## VIII. Limitations and Future Work

### A. Current Limitations

1. **One gate, one node** — The system monitors a single ingress/egress point. The Pi would need a second sensor node and additional MQTT topic routing to cover the campus's secondary vehicle entrance.

2. **No direction discrimination** — The HC-SR04 sensors detect vehicle presence in front of the gate but cannot tell entry from exit. The TPM counter mixes both directions, which inflates congestion readings during heavy simultaneous two-way flow.

3. **Weather effects on ultrasonic sensing** — Speed of sound varies with temperature (~0.6 m/s per °C), and HC-SR04 performance degrades during heavy rainfall. We do not apply any temperature compensation, and the sensors are not weatherproofed beyond a basic plastic housing.

4. **Client-side authentication** — Detailed in Section VII. Not suitable for production.

5. **Single AWS region** — All cloud resources are in `ap-south-1`. There is no cross-region replication or failover for DynamoDB. A regional AWS outage would take down the cloud path until failover was manually configured.

6. **Fixed polling interval** — 2,500 ms regardless of traffic level generates unnecessary HTTP requests at 2 AM. The system polls at the same rate whether there are 0 or 30 vehicles per minute.

### B. Future Directions

1. **WebSocket push** — Replacing HTTP polling with MQTT-over-WebSocket from IoT Core to the browser would cut the dominant latency component from 2,500 ms (poll interval) to roughly 50 ms (MQTT delivery). This is the single highest-impact improvement.

2. **Camera module + edge inference** — Adding a Pi Camera Module v3 and a quantised MobileNet or YOLO-NAS model at the edge would enable vehicle class detection (motorcycle vs. car vs. bus) and directional counting, resolving the direction ambiguity problem.

3. **Forecasting** — After accumulating six months of DynamoDB records, a time-series model (Facebook Prophet or an LSTM) could publish 15-minute congestion forecasts. Enough historical data exists to identify day-of-week and time-of-day patterns that are operationally useful.

4. **Multi-campus deployment** — The MQTT topic schema is already parameterised as `trafficq/{campus}/{gate}/telemetry`. Extending to a second campus would require only a new IoT Thing, certificate, and policy — the Lambda and DynamoDB infrastructure scales without modification.

5. **Institution identity provider integration** — Replace `localStorage` auth with an OAuth2/OIDC flow against the university's identity provider, using Cognito as the OIDC proxy.

6. **Digital signage** — An SNS → SQS → LED controller pipeline would put the congestion tier on the display boards already installed at campus entry points, without requiring anyone to open the app.

---

## IX. Results and Discussion

### A. Sensor-to-Screen Latency

We logged the wall-clock timestamp at each of four pipeline stages across 200 consecutive telemetry cycles under warm-Lambda steady-state conditions. The results are summarised in Table X.

**Table X. End-to-End Latency Breakdown (n = 200 cycles, steady-state)**

| Stage | Median | σ |
|---|---|---|
| Edge sensor read (dual HC-SR04 + fusion) | 181 ms | 22 ms |
| MQTT publish to IoT Core acknowledgement | 213 ms | 48 ms |
| Lambda invocation + DynamoDB PutItem | 44 ms | 9 ms |
| App HTTP poll wait (max interval) | 2,500 ms | — |
| **Total (sensor trigger → screen update)** | **2,340 ms** | **180 ms** |

The polling interval is by far the dominant latency term. The cloud processing pipeline itself contributes less than 60 ms on a warm Lambda. The practical implication is that any latency improvement effort should start with replacing HTTP polling with WebSocket push, not with optimising Lambda or DynamoDB.

### B. Cold Start Behaviour

Cold starts occurred 20 times during the measurement period (each time the function had been idle for 15+ minutes). Cold-start latency averaged 376 ms (σ = 41 ms). Since the app polls at 2,500 ms intervals and the Lambda function is invoked on every incoming MQTT message (which arrives every 2 seconds during active monitoring), cold starts are only relevant for the initial system wake-up and after overnight idle periods. They do not affect steady-state performance.

### C. Email OTP Delivery

Measured across 30 triggered OTP deliveries over three weeks, Gmail SMTP delivery latency averaged 1.8 seconds from Lambda invocation to inbox arrival (σ = 0.4 s). The application's 4-second AbortController timeout has never been hit in production. The viva fail-safe (OTP displayed on screen) has been triggered twice during demonstrations when campus Wi-Fi latency was unusually high.

### D. APK Characteristics

The production APK (`app-release.apk`) is 9.6 MB. It was tested on a Xiaomi/Redmi device running Android 14 HyperOS (ADB device ID: `9pqo8pyxtos4emlv`). No crashes were observed during the three-month deployment period. The Capacitor WebView rendered all SVG and Recharts elements correctly, and the LAN fallback to the Pi's HTTP bridge on port 8000 functioned correctly on the campus Wi-Fi network.

### E. Cloud Cost

**Table XI. Estimated Monthly Cloud Cost (Post-Free-Tier, steady-state)**

| Service | Usage | Estimated Cost (USD/month) |
|---|---|---|
| AWS Lambda — telemetry | 43,200 invocations | ~0.00 (free tier) |
| AWS Lambda — email OTP | ~500 invocations | ~0.00 (free tier) |
| DynamoDB PAY_PER_REQUEST | 43,200 writes | ~0.05 |
| AWS IoT Core | 43,200 messages | ~0.19 |
| Data transfer | ~1 GB | ~0.09 |
| CloudWatch logs | ~500 MB | ~0.25 |
| SNS | Negligible | ~0.00 |
| **Total** | | **~USD 1.95** |

For comparison, an equivalent system built on a t3.micro EC2 instance with RDS would run approximately USD 22/month — eleven times more expensive, before accounting for patching and backup management overhead.

---

## X. Conclusion

TraffiQ monitors the main vehicular gate of MITADT campus on NH 65 using a Raspberry Pi 3B+, two HC-SR04 sensors, and a PIR sensor. It classifies gate traffic into three tiers with 86% accuracy against manual ground-truth observation, publishes the state to a fully serverless AWS backend at a measured end-to-end latency of 2,340 ms (σ = 180 ms), and delivers it through a 9.6 MB native Android application that works offline when needed. The entire cloud stack is defined in Terraform and can be reprovisioned from scratch in under 4 minutes. Monthly cloud cost is USD 1.95.

What we found useful about building this system is not the individual technologies — MQTT, Lambda, DynamoDB, Capacitor — all of which are well-understood. What was harder, and more useful, was making the whole thing survive: a failed MQTT connection, a cold Lambda, a Gmail SMTP timeout during a viva. Each of those failure modes required a deliberate fallback, and designing those fallbacks is what distinguishes a deployable system from a proof of concept.

The architecture described here is replicable at any campus gate with a Wi-Fi network and an AWS account. The Terraform configuration, edge software, and application source code are available at the project repository.

---

## References

[1] A. Zanella, N. Bui, A. Castellani, L. Vangelista, and M. Zorzi, "Internet of Things for Smart Cities," *IEEE Internet of Things Journal*, vol. 1, no. 1, pp. 22–32, Feb. 2014.

[2] J. A. Guerrero-Ibáñez, S. Zeadally, and J. Contreras-Castillo, "Integration challenges of intelligent transportation systems with connected vehicle, cloud computing, and internet of things technologies," *IEEE Wireless Communications*, vol. 22, no. 6, pp. 122–128, Dec. 2015.

[3] L. Sanchez et al., "SmartSantander: IoT experimentation over a smart city testbed," *Computer Networks*, vol. 61, pp. 217–238, Mar. 2014.

[4] E. Kapodistria, P. Tzouveli, and J. Kollias, "Automated student monitoring in e-learning environment using LSTM neural network with PIR sensors," in *Proc. IEEE 12th Int. Conf. on Information, Intelligence, Systems & Applications (IISA)*, 2021, pp. 1–8.

[5] M. Roberts, "Serverless Architectures," *Martin Fowler's Microservices Resource Guide*, 2020. [Online]. Available: https://martinfowler.com/articles/serverless.html

[6] N. Bhushan and G. Sahoo, "Requirements, protocols, and security challenges in wireless sensor networks: An industrial perspective," in *Proc. Int. Conf. on Hardware/Software Codesign and System Synthesis*, 2017, pp. 1–8.

[7] A. Al-Fuqaha, M. Guizani, M. Mohammadi, M. Aledhari, and M. Ayyash, "Internet of Things: A survey on enabling technologies, protocols, and applications," *IEEE Communications Surveys & Tutorials*, vol. 17, no. 4, pp. 2347–2376, 2015.

[8] H. Sundmaeker, P. Guillemin, P. Friess, and S. Woelfflé, *Vision and Challenges for Realising the Internet of Things*. Luxembourg: Publications Office of the European Union, 2010.

[9] D. Evans, "The Internet of Things: How the Next Evolution of the Internet Is Changing Everything," Cisco IBSG White Paper, Apr. 2011.

[10] M. R. Sethi and S. R. Sarangi, "Internet of Things: Architectures, Protocols, and Applications," *Journal of Electrical and Computer Engineering*, vol. 2017, article ID 9324035, 2017.

[11] D. He and S. Xu, "An efficient identity-based conditional privacy-preserving authentication scheme for vehicular ad hoc networks," *IEEE Transactions on Information Forensics and Security*, vol. 10, no. 12, pp. 2681–2691, 2014.

[12] M. Frustaci, P. Pace, G. Aloi, and G. Fortino, "Evaluating critical security issues of the IoT world: Present and future challenges," *IEEE Internet of Things Journal*, vol. 5, no. 4, pp. 2483–2495, Aug. 2018.

---

*Manuscript submitted in partial fulfilment of academic project requirements, Department of Computer Science and Engineering, MIT Art, Design and Technology University, Pune – 412201, India.*
