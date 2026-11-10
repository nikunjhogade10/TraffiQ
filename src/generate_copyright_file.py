#!/usr/bin/env python3
"""
Official Source Code Dossier Generator for Copyright Registration
Document: COPYRIGHT REGISTRATION — COMPUTER SOFTWARE
Work: TraffiQ — MIT-ADT Campus Smart Traffic and Gate Monitoring System
Applicants / Authors:
  1. Rajani Sangappa Sajjan
  2. Nikunj Santosh Hogade
  3. Adwait Pravin Kharade
  4. Shriraj Omkar Salunke
  5. Arayan Atul Londhe
Project Location:
  MIT Art, Design and Technology University, Rajbaug Campus,
  Loni Kalbhor, Pune – 412201, Maharashtra, India
"""

import os

WORKSPACE_ROOT = "/Users/nikunjsantoshhogade/Downloads/Traffic project"

TITLE_OF_WORK = "TraffiQ — MIT-ADT Campus Smart Traffic and Gate Monitoring System"

AUTHORS = [
    "Rajani Sangappa Sajjan",
    "Nikunj Santosh Hogade",
    "Adwait Pravin Kharade",
    "Shriraj Omkar Salunke",
    "Arayan Atul Londhe",
]

PROJECT_LOCATION = (
    "MIT Art, Design and Technology University, Rajbaug Campus, "
    "Loni Kalbhor, Pune – 412201, Maharashtra, India"
)

COPYRIGHT_NOTICE = (
    "Copyright © 2026 — Authors: Rajani Sangappa Sajjan, Nikunj Santosh Hogade, "
    "Adwait Pravin Kharade, Shriraj Omkar Salunke, and Arayan Atul Londhe."
)

MODULE_COPYRIGHT_HEADER = (
    "Copyright © 2026 — Authors: Rajani Sangappa Sajjan, Nikunj Santosh Hogade, "
    "Adwait Pravin Kharade, Shriraj Omkar Salunke, and Arayan Atul Londhe. All Rights Reserved."
)

# Active, genuine source code files of the single-gate TraffiQ system
SOURCE_FILES = [
    # Domain Architecture & Core Controller
    ("Core Domain Types & Telemetry Models", "src/app/types.ts", "typescript", "Domain interfaces, sensor telemetry schemas, and traffic status types"),
    ("Root Application Controller & Simulation Dispatcher", "src/app/App.tsx", "tsx", "Central navigation controller, telemetry state engine, and preset simulator dispatcher"),

    # Primary Screen Modules (Single-Gate Deployment Scope)
    ("Main Campus Gate Dashboard & Circular Gauge Visualizer", "src/app/components/screens/DashboardScreen.tsx", "tsx", "Real-time telemetry gauge, honest motion activity, barrier clearance, and travel recommendations"),
    ("MapLibre GL JS Interactive Campus Road Map", "src/app/components/screens/LiveMapScreen.tsx", "tsx", "High-precision vector map with dynamic GeoJSON approach road congestion overlay and sensor markers"),
    ("IoT Edge Diagnostics & Academic Simulator Screen", "src/app/components/screens/SensorsSettingsScreen.tsx", "tsx", "Hardware diagnostic feed (GPIO pins, AWS connection) and one-tap scenario simulator controls"),
    ("Hourly Telemetry Trends & Recharts Analytics Screen", "src/app/components/screens/AnalyticsScreen.tsx", "tsx", "Time-series visualization plotting hourly PIR trigger frequency and HC-SR04 barrier clearance trends"),
    ("Real-Time Incident & Congestion Alert Feed Screen", "src/app/components/screens/AlertsScreen.tsx", "tsx", "Categorized notifications for traffic bottlenecks, clearance events, and edge sensor telemetry faults"),
    ("Gate Shift Metrics & Queue Diagnostics Screen", "src/app/components/screens/GateTrafficDetailsScreen.tsx", "tsx", "Gate security shift metrics, estimated queues, and vehicle clearance throughput analytics"),

    # Authentication & Advisory Screens
    ("Academic Demo Login & Authentication Screen", "src/app/components/screens/LoginScreen.tsx", "tsx", "Secure credential entry, demo bypass for evaluators, and visual branding authentication"),
    ("Self-Service Password Recovery Screen", "src/app/components/screens/ForgotPasswordScreen.tsx", "tsx", "Multi-step academic ID verification and automated password recovery workflow"),
    ("Critical Congestion Advisory Modal Screen", "src/app/components/screens/CriticalAlertScreen.tsx", "tsx", "Full-screen high-priority alert for emergency vehicle clearance and severe approach road gridlock"),
    ("Campus Profile & Academic Disclosure Screen", "src/app/components/screens/ProfileScreen.tsx", "tsx", "Institution deployment disclosures, truthful telemetry declaration, and academic project specifications"),

    # Active Shared Utilities
    ("Design System Class Merge Utility", "src/app/components/ui/utils.ts", "typescript", "Tailwind CSS class merger utility supporting conditional styling and component variance"),

    # Edge Hardware & Cloud Processing
    ("Raspberry Pi 4 IoT Edge Telemetry Collector", "src/edge/gate_sensor_node.py", "python", "Hardware GPIO reader for PIR (GPIO 17) and HC-SR04 (GPIO 27/22) with AWS IoT Core MQTT publisher"),
    ("AWS Lambda Cloud Rule Evaluator & DynamoDB Handler", "src/cloud/lambda_telemetry_processor.py", "python", "Cloud serverless function evaluating congestion rules, calculating delay, and saving to Amazon DynamoDB"),

    # Entry Point, Styling & Build Configuration
    ("Application React DOM Entry Point", "src/main.tsx", "tsx", "Vite React mounting root initiating application rendering and global styling"),
    ("MIT-ADT Visual Identity Design System Tokens", "src/styles/theme.css", "css", "Curated color variables (University Purple #4B168C, Gold #D6A52A) and typography tokens"),
    ("Vite Build & Bundler Configuration", "vite.config.ts", "typescript", "Build tooling configuration including Tailwind CSS plugins, React fast refresh, and path aliases"),
    ("Project Manifest & Dependency Specifications", "package.json", "json", "NPM package manifest detailing runtime dependencies, dev tools, and build scripts"),
]

def generate_text_doc():
    lines = []
    border = "=" * 80
    sub_border = "-" * 80

    lines.append(border)
    lines.append("COPYRIGHT REGISTRATION — COMPUTER SOFTWARE")
    lines.append("FILING DOSSIER UNDER SECTION 2(o) OF THE COPYRIGHT ACT, 1957")
    lines.append(border)
    lines.append(f"TITLE OF WORK: {TITLE_OF_WORK}")
    lines.append("")
    lines.append("APPLICANTS / AUTHORS:")
    for i, author in enumerate(AUTHORS, 1):
        lines.append(f"  {i}. {author}")
    lines.append("")
    lines.append(f"COPYRIGHT NOTICE: {COPYRIGHT_NOTICE}")
    lines.append("")
    lines.append("PROJECT LOCATION:")
    lines.append(f"  {PROJECT_LOCATION}")
    lines.append("")
    lines.append("CATEGORY OF WORK: Computer Software (Literary Work)")
    lines.append("YEAR OF CREATION / COMPLETION: 2026")
    lines.append("JURISDICTION: Pune, Maharashtra, India")
    lines.append(border)
    lines.append("")
    lines.append("SECTION 1: STATEMENT OF AUTHORSHIP & INSTITUTIONAL CONTEXT")
    lines.append(sub_border)
    lines.append("1.1 STATEMENT OF JOINT AUTHORSHIP:")
    lines.append("We, the applicants:")
    for author in AUTHORS:
        lines.append(f"  - {author}")
    lines.append("declare that we are the authors and developers of the original computer program")
    lines.append(f"entitled \"{TITLE_OF_WORK}\".")
    lines.append("")
    lines.append("1.2 INSTITUTIONAL CONTEXT & IP POLICY ADVISORY:")
    lines.append("This software was engineered in connection with project work at MIT Art,")
    lines.append("Design and Technology University, Rajbaug Campus, Loni Kalbhor, Pune.")
    lines.append("Advisory for Applicants: The applicants must verify the university's institutional")
    lines.append("project and Intellectual Property (IP) guidelines or obtain a formal No Objection")
    lines.append("Certificate (NOC) / Endorsement from university authorities if required by the")
    lines.append("institution or the Copyright Office prior to final submission.")
    lines.append("")
    lines.append("1.3 CONSISTENCY WITH APPLICATION FORMS:")
    lines.append("The names and particulars of the applicants stated herein must correspond")
    lines.append("strictly with Form XIV, the Statement of Particulars, and all supporting applicant")
    lines.append("identification documents submitted to the Copyright Office.")
    lines.append("")
    lines.append(sub_border)
    lines.append("SECTION 2: SOURCE-CODE SUBMISSION & PORTAL UPLOAD GUIDANCE")
    lines.append(sub_border)
    lines.append("Filing instructions for Computer Software (Form XIV) vary based on the specific")
    lines.append("guidelines of the Copyright Office e-filing portal:")
    lines.append("  - Accepted Formats: Portals typically require software source code in PDF or")
    lines.append("    plain text (TXT) format within designated portal file-size thresholds.")
    lines.append("  - Extent of Code: Depending on portal instructions, applicants may upload the")
    lines.append("    complete source code, or may be prompted to provide a defined extract (such")
    lines.append("    as the first 10 and last 10 pages) if the codebase exceeds page limits.")
    lines.append("  - Scope of this Compilation: This document contains the full source code of all")
    lines.append("    19 active modules comprising the software. If a partial extract or PDF is")
    lines.append("    mandated by portal prompts, applicants should format the submission accordingly.")
    lines.append("")
    lines.append(sub_border)
    lines.append("SECTION 3: MASTER SOURCE CODE MANIFEST & FILE INDEX")
    lines.append(sub_border)
    lines.append(f"{'SL':<3} | {'FILE PATH':<50} | {'LINES':<6} | {'MODULE DESCRIPTION'}")
    lines.append(sub_border)

    total_code_lines = 0
    file_stats = []

    for idx, (title, rel_path, lang, desc) in enumerate(SOURCE_FILES, 1):
        full_path = os.path.join(WORKSPACE_ROOT, rel_path)
        if os.path.exists(full_path):
            with open(full_path, "r", encoding="utf-8") as f:
                lc = len(f.read().splitlines())
            total_code_lines += lc
            file_stats.append((idx, title, rel_path, lang, desc, lc))
            lines.append(f"{idx:02d}  | {rel_path:<50} | {lc:>5}  | {title}")
        else:
            lines.append(f"{idx:02d}  | {rel_path:<50} | MISSING | {title}")

    lines.append(sub_border)
    lines.append(f"TOTAL ACTIVE SOURCE CODE MODULES: {len(file_stats)}")
    lines.append(f"TOTAL COMPILATION LINES OF CODE: {total_code_lines}")
    lines.append(border)
    lines.append("")
    lines.append("SECTION 4: COMPLETE SOURCE CODE LISTINGS")
    lines.append(border)
    lines.append("")

    for idx, title, rel_path, lang, desc, lc in file_stats:
        full_path = os.path.join(WORKSPACE_ROOT, rel_path)
        with open(full_path, "r", encoding="utf-8") as f:
            file_lines = f.read().splitlines()

        lines.append(border)
        lines.append(f"MODULE {idx:02d} OF {len(file_stats):02d}: {title.upper()}")
        lines.append(f"FILE PATH: {rel_path}")
        lines.append(f"DESCRIPTION: {desc}")
        lines.append(f"LANGUAGE / SYNTAX: {lang.upper()} | LINE COUNT: {lc}")
        lines.append(f"COPYRIGHT: {MODULE_COPYRIGHT_HEADER}")
        lines.append(f"PROJECT LOCATION: {PROJECT_LOCATION}")
        lines.append(border)

        for l_num, line_str in enumerate(file_lines, 1):
            lines.append(f"{l_num:05d}: {line_str}")

        lines.append("")
        lines.append(f"--- [END OF MODULE {idx:02d}: {rel_path}] ---")
        lines.append("")

    lines.append(border)
    lines.append("SECTION 5: APPLICANTS' STATEMENT AND PRE-SUBMISSION VERIFICATION")
    lines.append(border)
    lines.append("This document contains the source code of the TraffiQ system as authored by the")
    lines.append("applicants. The applicants must review, verify, and confirm the document contents")
    lines.append("prior to executing and uploading to the Copyright Office portal.")
    lines.append("")
    lines.append("APPLICANTS / AUTHORS:")
    for author in AUTHORS:
        lines.append(f"  - {author}")
    lines.append("")
    lines.append("DATE: October 2026")
    lines.append("PLACE: Pune, Maharashtra, India")
    lines.append(border)
    lines.append("--- END OF COPYRIGHT SOURCE CODE COMPILATION ---")
    lines.append(border)

    return "\n".join(lines)


def generate_markdown_doc():
    lines = []
    lines.append("# COPYRIGHT REGISTRATION — COMPUTER SOFTWARE")
    lines.append("## Statutory Filing Dossier under Form XIV (Indian Copyright Act, 1957)")
    lines.append("")
    lines.append(f"> **Title of Work:** {TITLE_OF_WORK}  ")
    lines.append("> **Category of Work:** Computer Software (Literary Work under Section 2(o))  ")
    lines.append("> **Applicants & Authors:**  ")
    for author in AUTHORS:
        lines.append(f"> - **{author}**  ")
    lines.append(f"> **Copyright Notice:** {COPYRIGHT_NOTICE}  ")
    lines.append(f"> **Project Location:** {PROJECT_LOCATION}  ")
    lines.append("> **Year of Creation:** 2026 | **Jurisdiction:** Pune, Maharashtra, India  ")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## 1. STATEMENT OF AUTHORSHIP & INSTITUTIONAL CONTEXT")
    lines.append("")
    lines.append("### 1.1 Joint Authorship Declaration")
    lines.append("We, the applicants:")
    for author in AUTHORS:
        lines.append(f"- **{author}**")
    lines.append(f"declare that we are the authors and developers of the original computer program titled **\"{TITLE_OF_WORK}\"**.")
    lines.append("")
    lines.append("### 1.2 Institutional Context & IP Policy Advisory")
    lines.append("This software was engineered in connection with project work at **MIT Art, Design and Technology University, Rajbaug Campus, Loni Kalbhor, Pune**.")
    lines.append("")
    lines.append("> [!IMPORTANT]")
    lines.append("> **Advisory for Applicants:** Intellectual property guidelines arising from projects are governed by institutional intellectual property policies. The applicants should verify the institution's guidelines or obtain an official No Objection Certificate (NOC) / Endorsement from university authorities if required by the institution or the Copyright Office prior to filing.")
    lines.append("")
    lines.append("### 1.3 Consistency Across Application Forms")
    lines.append("The particulars stated in this compilation document must correspond strictly with **Form XIV**, the **Statement of Particulars (SoP)**, and all supporting applicant identification records submitted to the Copyright Office.")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## 2. SYSTEM ARCHITECTURE SPECIFICATION")
    lines.append("")
    lines.append("```mermaid")
    lines.append("graph TD")
    lines.append("    subgraph Edge Hardware [\"Campus Gate IoT Node (Raspberry Pi 4)\"]")
    lines.append("        PIR[\"PIR Motion Sensor (GPIO 17)<br/>Motion Trigger Frequency\"]")
    lines.append("        US[\"HC-SR04 Ultrasonic (GPIO 27/22)<br/>Barrier Clearance Distance\"]")
    lines.append("        RPI[\"Raspberry Pi Edge Controller<br/>Telemetry Normalization (Python)\"]")
    lines.append("        PIR --> RPI")
    lines.append("        US --> RPI")
    lines.append("    end")
    lines.append("")
    lines.append("    subgraph Cloud Infrastructure [\"AWS Cloud Infrastructure (ap-south-1 Mumbai)\"]")
    lines.append("        MQTT[\"AWS IoT Core (MQTT over TLS)<br/>Topic: mitadt/campus/gate/main/telemetry\"]")
    lines.append("        LAMBDA[\"AWS Lambda Telemetry Evaluator<br/>Rule Processing & Heuristics\"]")
    lines.append("        DDB[(\"Amazon DynamoDB<br/>Historical Telemetry Store\")]")
    lines.append("        RPI -->|MQTT TLS (Port 8883)| MQTT")
    lines.append("        MQTT --> LAMBDA")
    lines.append("        LAMBDA --> DDB")
    lines.append("    end")
    lines.append("")
    lines.append("    subgraph Frontend Client [\"TraffiQ Client Web Application (React + TypeScript)\"]")
    lines.append("        DASH[\"Main Gate Dashboard & Circular Gauge\"]")
    lines.append("        MAP[\"MapLibre GL JS Real-Time Road Overlay\"]")
    lines.append("        ANALYTICS[\"Recharts Hourly Trends & Rush Analysis\"]")
    lines.append("        SETTINGS[\"Hardware Diagnostics & Simulator\"]")
    lines.append("        ALERTS[\"Real-time Incident Notification Feed\"]")
    lines.append("        LAMBDA -.->|API / WebSocket Stream| DASH")
    lines.append("        LAMBDA -.->|Dynamic GeoJSON Line State| MAP")
    lines.append("        DDB -.->|Historical Series Query| ANALYTICS")
    lines.append("    end")
    lines.append("```")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## 3. MASTER SOURCE CODE MANIFEST & FILE INDEX")
    lines.append("")
    lines.append("| Sl. | Component / Module Name | File Path | Language | Line Count | Description |")
    lines.append("|:---:|:---|:---|:---:|:---:|:---|")

    idx = 1
    file_stats = []
    for title, rel_path, lang, desc in SOURCE_FILES:
        full_path = os.path.join(WORKSPACE_ROOT, rel_path)
        if os.path.exists(full_path):
            with open(full_path, "r", encoding="utf-8") as f:
                lc = len(f.read().splitlines())
            file_stats.append((idx, title, rel_path, lang, desc, lc))
            lines.append(f"| {idx:02d} | **{title}** | `{rel_path}` | {lang.upper()} | {lc} | {desc} |")
            idx += 1

    total_lc = sum(x[5] for x in file_stats)
    lines.append("")
    lines.append(f"**Total Active Modules:** {len(file_stats)}  ")
    lines.append(f"**Total Compilation Lines of Code:** {total_lc}  ")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## 4. COMPLETE SOURCE CODE LISTINGS")
    lines.append("")

    for idx, title, rel_path, lang, desc, lc in file_stats:
        full_path = os.path.join(WORKSPACE_ROOT, rel_path)
        with open(full_path, "r", encoding="utf-8") as f:
            code = f.read()

        lines.append(f"### SECTION 4.{idx:02d}: {title.upper()}")
        lines.append(f"**Target Path:** `{rel_path}`  ")
        lines.append(f"**Language:** `{lang}` | **Line Count:** `{lc}`  ")
        lines.append(f"**Copyright:** `{MODULE_COPYRIGHT_HEADER}`  ")
        lines.append(f"**Project Location:** `{PROJECT_LOCATION}`")
        lines.append("")
        lines.append(f"```{lang}")
        lines.append(code)
        lines.append("```")
        lines.append("")
        lines.append("---")
        lines.append("")

    lines.append("## 5. APPLICANTS' STATEMENT AND PRE-SUBMISSION VERIFICATION")
    lines.append("")
    lines.append("This document contains the source code of the TraffiQ system as authored by the applicants. The applicants must review, verify, and confirm the document contents prior to executing and uploading to the Copyright Office portal.")
    lines.append("")
    lines.append("**Applicants & Authors:**")
    for author in AUTHORS:
        lines.append(f"- {author}")
    lines.append("")
    lines.append("- **Date:** October 2026")
    lines.append("- **Place:** Pune, Maharashtra, India")
    lines.append("")

    return "\n".join(lines)


if __name__ == "__main__":
    txt_content = generate_text_doc()
    txt_path = os.path.join(WORKSPACE_ROOT, "TRAFFIQ_SOURCE_CODE_COPYRIGHT.txt")
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(txt_content)
    print(f"Generated TXT: {txt_path} ({len(txt_content)} bytes)")

    md_content = generate_markdown_doc()
    md_path = os.path.join(WORKSPACE_ROOT, "TRAFFIQ_SOURCE_CODE_COPYRIGHT.md")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(md_content)
    print(f"Generated MD: {md_path} ({len(md_content)} bytes)")
