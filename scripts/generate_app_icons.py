#!/usr/bin/env python3
"""
Generate high-fidelity TraffiQ application launcher icons and splash screens for Android.
Uses pure Python standard library (struct + zlib) to render crisp RGBA PNGs
at all standard Android mipmap and splash screen resolutions.
"""

import math
import os
import struct
import zlib


def write_png(width: int, height: int, rgba_bytes: bytearray, filepath: str):
    """Encodes raw RGBA buffer into a valid PNG file."""
    raw_data = bytearray()
    row_stride = width * 4
    for y in range(height):
        raw_data.append(0)  # Filter byte: None
        start = y * row_stride
        raw_data.extend(rgba_bytes[start : start + row_stride])

    compressed = zlib.compress(bytes(raw_data), 9)

    def chunk(tag: bytes, data: bytes) -> bytes:
        length = struct.pack(">I", len(data))
        crc = struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        return length + tag + data + crc

    png = bytearray(b"\x89PNG\r\n\x1a\n")
    ihdr_data = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    png.extend(chunk(b"IHDR", ihdr_data))
    png.extend(chunk(b"IDAT", compressed))
    png.extend(chunk(b"IEND", b""))

    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "wb") as f:
        f.write(png)


def render_traffiq_icon(size: int, is_foreground_only: bool = False, is_round: bool = False) -> bytearray:
    """Renders the TraffiQ brand icon at any resolution."""
    buf = bytearray(size * size * 4)

    def set_pixel(x, y, r, g, b, a=255):
        if 0 <= x < size and 0 <= y < size:
            idx = (y * size + x) * 4
            src_a = a / 255.0
            dst_a = buf[idx + 3] / 255.0
            out_a = src_a + dst_a * (1.0 - src_a)
            if out_a > 0:
                buf[idx] = int((r * src_a + buf[idx] * dst_a * (1.0 - src_a)) / out_a)
                buf[idx + 1] = int((g * src_a + buf[idx + 1] * dst_a * (1.0 - src_a)) / out_a)
                buf[idx + 2] = int((b * src_a + buf[idx + 2] * dst_a * (1.0 - src_a)) / out_a)
                buf[idx + 3] = int(out_a * 255)

    cx = size / 2.0
    cy = size / 2.0

    # 1. Background layer
    if not is_foreground_only:
        radius = size * 0.48 if is_round else size * 0.22
        for y in range(size):
            for x in range(size):
                dx = abs(x - cx)
                dy = abs(y - cy)
                inside = False
                if is_round:
                    dist = math.hypot(x - cx, y - cy)
                    if dist <= radius:
                        inside = True
                else:
                    rx = size * 0.44
                    ry = size * 0.44
                    cr = size * 0.18
                    if dx <= rx - cr and dy <= ry:
                        inside = True
                    elif dy <= ry - cr and dx <= rx:
                        inside = True
                    elif dx > rx - cr and dy > ry - cr:
                        cdist = math.hypot(dx - (rx - cr), dy - (ry - cr))
                        if cdist <= cr:
                            inside = True

                if inside:
                    t = y / size
                    r = int(28 + t * (46 - 28))
                    g = int(12 + t * (15 - 12))
                    b = int(58 + t * (90 - 58))
                    set_pixel(x, y, r, g, b, 255)

    # 2. Icon graphics
    scale = size / 108.0

    def draw_line(x0, y0, x1, y1, width_px, r, g, b, a=255):
        length = math.hypot(x1 - x0, y1 - y0)
        if length == 0:
            return
        steps = int(length * 2.5) + 1
        for i in range(steps + 1):
            px = x0 + (x1 - x0) * (i / steps)
            py = y0 + (y1 - y0) * (i / steps)
            r_ceil = int(math.ceil(width_px / 2.0))
            for ox in range(-r_ceil, r_ceil + 1):
                for oy in range(-r_ceil, r_ceil + 1):
                    d = math.hypot(ox, oy)
                    if d <= width_px / 2.0:
                        set_pixel(int(px + ox), int(py + oy), r, g, b, a)

    # Live Sensor Arcs (Gold: #D6A52A)
    arc_center_x = cx
    arc_center_y = cy - 20 * scale
    for angle_deg in range(210, 330, 2):
        rad = math.radians(angle_deg)
        ax = arc_center_x + math.cos(rad) * (20 * scale)
        ay = arc_center_y + math.sin(rad) * (14 * scale)
        draw_line(ax, ay, ax, ay, 2.8 * scale, 214, 165, 42, 230)

    for angle_deg in range(220, 320, 3):
        rad = math.radians(angle_deg)
        ax = arc_center_x + math.cos(rad) * (12 * scale)
        ay = arc_center_y + math.sin(rad) * (8 * scale)
        draw_line(ax, ay, ax, ay, 2.5 * scale, 245, 197, 66, 240)

    pulse_y = arc_center_y - 2 * scale
    draw_line(cx, pulse_y, cx, pulse_y, 4.0 * scale, 255, 215, 0, 255)

    # Campus Gate Arch (White: #FFFFFF)
    gate_left = cx - 18 * scale
    gate_right = cx + 18 * scale
    gate_top = cy - 14 * scale
    gate_bottom = cy + 22 * scale
    pillar_w = 4.2 * scale

    draw_line(gate_left, gate_bottom, gate_left, gate_top + 8 * scale, pillar_w, 255, 255, 255, 255)
    draw_line(gate_right, gate_bottom, gate_right, gate_top + 8 * scale, pillar_w, 255, 255, 255, 255)

    arch_r = 18 * scale
    for angle_deg in range(180, 360, 2):
        rad = math.radians(angle_deg)
        ax = cx + math.cos(rad) * arch_r
        ay = (gate_top + 8 * scale) + math.sin(rad) * (12 * scale)
        draw_line(ax, ay, ax, ay, pillar_w, 255, 255, 255, 255)

    draw_line(gate_left - 4 * scale, gate_bottom, gate_left + 4 * scale, gate_bottom, 3.0 * scale, 255, 255, 255, 255)
    draw_line(gate_right - 4 * scale, gate_bottom, gate_right + 4 * scale, gate_bottom, 3.0 * scale, 255, 255, 255, 255)

    # Barrier Arm across Gate (#D6A52A)
    barrier_y = cy + 6 * scale
    barrier_left = cx - 22 * scale
    barrier_right = cx + 22 * scale
    draw_line(barrier_left, barrier_y, barrier_right, barrier_y, 4.5 * scale, 214, 165, 42, 255)
    draw_line(cx - 12 * scale, barrier_y, cx - 12 * scale, barrier_y, 6.0 * scale, 255, 255, 255, 255)

    # TraffiQ Center "Q" Badge
    q_cx = cx
    q_cy = cy + 2 * scale
    q_r = 7.5 * scale
    for angle_deg in range(0, 360, 4):
        rad = math.radians(angle_deg)
        qx = q_cx + math.cos(rad) * q_r
        qy = q_cy + math.sin(rad) * q_r
        draw_line(qx, qy, qx, qy, 2.8 * scale, 255, 215, 0, 255)

    draw_line(q_cx + 3 * scale, q_cy + 3 * scale, q_cx + 9 * scale, q_cy + 9 * scale, 3.2 * scale, 255, 215, 0, 255)

    return buf


def render_splash(width: int, height: int) -> bytearray:
    """Renders a full-screen TraffiQ launch splash screen with deep purple background."""
    buf = bytearray(width * height * 4)

    # Fill background with TraffiQ Royal Deep Purple gradient: #14082A to #220A45
    for y in range(height):
        t = y / float(height)
        r = int(20 + t * (34 - 20))
        g = int(8 + t * (10 - 8))
        b = int(42 + t * (69 - 42))
        row_offset = y * width * 4
        for x in range(width):
            idx = row_offset + x * 4
            buf[idx] = r
            buf[idx + 1] = g
            buf[idx + 2] = b
            buf[idx + 3] = 255

    # Center TraffiQ emblem
    icon_dim = int(min(width, height) * 0.42)
    if icon_dim < 64:
        icon_dim = 64
    icon_buf = render_traffiq_icon(icon_dim, is_foreground_only=True)

    start_x = (width - icon_dim) // 2
    start_y = (height - icon_dim) // 2 - int(height * 0.04)  # slightly above center

    for y in range(icon_dim):
        for x in range(icon_dim):
            src_idx = (y * icon_dim + x) * 4
            src_a = icon_buf[src_idx + 3] / 255.0
            if src_a > 0:
                dst_x = start_x + x
                dst_y = start_y + y
                if 0 <= dst_x < width and 0 <= dst_y < height:
                    dst_idx = (dst_y * width + dst_x) * 4
                    buf[dst_idx] = int(icon_buf[src_idx] * src_a + buf[dst_idx] * (1.0 - src_a))
                    buf[dst_idx + 1] = int(icon_buf[src_idx + 1] * src_a + buf[dst_idx + 1] * (1.0 - src_a))
                    buf[dst_idx + 2] = int(icon_buf[src_idx + 2] * src_a + buf[dst_idx + 2] * (1.0 - src_a))

    return buf


def main():
    res_dir = "android/app/src/main/res"

    # 1. Launcher Mipmaps
    densities = {
        "mipmap-mdpi": (48, 108),
        "mipmap-hdpi": (72, 162),
        "mipmap-xhdpi": (96, 216),
        "mipmap-xxhdpi": (144, 324),
        "mipmap-xxxhdpi": (192, 432),
    }

    print("Generating crisp TraffiQ Android app icons...")
    for folder, (full_size, fg_size) in densities.items():
        dir_path = os.path.join(res_dir, folder)
        full_buf = render_traffiq_icon(full_size, is_foreground_only=False, is_round=False)
        write_png(full_size, full_size, full_buf, os.path.join(dir_path, "ic_launcher.png"))

        round_buf = render_traffiq_icon(full_size, is_foreground_only=False, is_round=True)
        write_png(full_size, full_size, round_buf, os.path.join(dir_path, "ic_launcher_round.png"))

        fg_buf = render_traffiq_icon(fg_size, is_foreground_only=True, is_round=False)
        write_png(fg_size, fg_size, fg_buf, os.path.join(dir_path, "ic_launcher_foreground.png"))
        print(f"  ✓ {folder}: {full_size}x{full_size}")

    # 2. Splash Screens across all portrait and landscape resolutions
    splash_targets = {
        "drawable/splash.png": (480, 800),
        "drawable-port-mdpi/splash.png": (320, 480),
        "drawable-port-hdpi/splash.png": (480, 800),
        "drawable-port-xhdpi/splash.png": (720, 1280),
        "drawable-port-xxhdpi/splash.png": (960, 1600),
        "drawable-port-xxxhdpi/splash.png": (1280, 1920),
        "drawable-land-mdpi/splash.png": (480, 320),
        "drawable-land-hdpi/splash.png": (800, 480),
        "drawable-land-xhdpi/splash.png": (1280, 720),
        "drawable-land-xxhdpi/splash.png": (1600, 960),
        "drawable-land-xxxhdpi/splash.png": (1920, 1280),
    }

    print("\nGenerating branded TraffiQ launch splash screens...")
    for rel_path, (w, h) in splash_targets.items():
        out_path = os.path.join(res_dir, rel_path)
        splash_buf = render_splash(w, h)
        write_png(w, h, splash_buf, out_path)
        print(f"  ✓ {rel_path}: {w}x{h}")

    print("\nAll launcher icons and splash screens generated successfully!")


if __name__ == "__main__":
    main()
