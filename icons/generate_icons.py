#!/usr/bin/env python3
"""Generate PNG icons for PAPOTE from SVG"""

import subprocess
import os

svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#0a0a0a"/>
  <circle cx="256" cy="256" r="200" fill="none" stroke="#e8c060" stroke-width="12"/>
  <circle cx="256" cy="256" r="185" fill="none" stroke="#c89830" stroke-width="2"/>
  <g transform="translate(256,256)">
    <path d="M -40 -80 L 20 -80 L 80 -20 L 80 40 L 40 60 L -40 60 L -40 -80 Z" fill="#e8c060" opacity="0.9"/>
    <path d="M 20 -80 L 80 -20 L 80 40 L 40 60 L 40 -60 L 20 -80 Z" fill="#c89830"/>
    <path d="M -40 60 L 40 60 L 40 40 L -40 40 Z" fill="#a87818"/>
    <path d="M -60 -40 L -40 -40 L -40 40 L -60 40 Z" fill="#e8c060" opacity="0.8"/>
  </g>
</svg>"""

# Save SVG temporarily
with open('papote_icon.svg', 'w') as f:
    f.write(svg_content)

# Generate 192x192
try:
    subprocess.run(['convert', 'papote_icon.svg', '-resize', '192x192', 'icon-192.png'], check=True)
    print("✓ icon-192.png created")
except Exception as e:
    print(f"Error creating 192x192: {e}")

# Generate 512x512
try:
    subprocess.run(['convert', 'papote_icon.svg', '-resize', '512x512', 'icon-512.png'], check=True)
    print("✓ icon-512.png created")
except Exception as e:
    print(f"Error creating 512x512: {e}")

# Generate 512x512 maskable
try:
    subprocess.run(['convert', 'papote_icon.svg', '-resize', '512x512', 'icon-512-maskable.png'], check=True)
    print("✓ icon-512-maskable.png created")
except Exception as e:
    print(f"Error creating maskable: {e}")

# Cleanup
os.remove('papote_icon.svg')
print("\n✓ All icons generated successfully!")
