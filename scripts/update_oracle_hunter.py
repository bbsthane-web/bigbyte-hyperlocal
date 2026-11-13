import subprocess
import os

key_path = os.path.expanduser("~/.ssh/oracle_vps_key")
vps_host = "ubuntu@129.80.152.233"

remote_code = """
path = '/home/ubuntu/hunter/oracle_ampere_hunter.py'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('4 OCPU, 24 GB RAM', '2 OCPU, 12 GB RAM')
c = c.replace('4 OCPU / 24 GB', '2 OCPU / 12 GB')
c = c.replace('BigByte-Ampere-24GB-Master', 'BigByte-Ampere-12GB-Master')
c = c.replace('ocpus=4.0', 'ocpus=2.0')
c = c.replace('memory_in_gbs=24.0', 'memory_in_gbs=12.0')
with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
print('UPDATED_REMOTE_HUNTER_OK')
"""

cmd = [
    "ssh",
    "-i", key_path,
    "-o", "StrictHostKeyChecking=no",
    vps_host,
    f"python3 -c \"{remote_code.strip()}\" && pm2 restart ampere-hunter && pm2 logs ampere-hunter --lines 10 --nostream"
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("STDOUT:\n", res.stdout)
print("STDERR:\n", res.stderr)
print("Return code:", res.returncode)
