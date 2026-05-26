"""
Fast icon generator — pure Python stdlib, no deps.
Generates solid-color PNGs using zlib row compression.
Run: python3 scripts/gen-icons.py
"""
import struct, zlib, os

def write_png(path, width, height, fill_rgba):
    """Write a solid-color RGBA PNG."""
    r, g, b, a = fill_rgba

    def chunk(tag, data):
        c = tag + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xFFFFFFFF)

    # One row: filter byte 0 + RGBA pixels
    row = b'\x00' + bytes([r, g, b, a] * width)
    raw = row * height
    compressed = zlib.compress(raw, 1)   # level 1 = fast

    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png  = b'\x89PNG\r\n\x1a\n'
    png += chunk(b'IHDR', ihdr)
    png += chunk(b'IDAT', compressed)
    png += chunk(b'IEND', b'')

    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'wb') as f:
        f.write(png)
    print(f'  wrote {path}  ({width}x{height})')

def run():
    base = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'app')

    print('Generating icons...')

    # Main app icon — pastel pink (#FFB6C1)
    write_png(os.path.join(base, 'build', 'icon.png'),
              1024, 1024, (255, 182, 193, 255))

    # Tray icons — dark (#0A0A0B) so they show on light menu bars
    write_png(os.path.join(base, 'resources', 'tray-icon.png'),
              32, 32, (10, 10, 11, 255))
    write_png(os.path.join(base, 'resources', 'tray-icon@2x.png'),
              64, 64, (10, 10, 11, 255))

    print('Done.')

if __name__ == '__main__':
    run()
