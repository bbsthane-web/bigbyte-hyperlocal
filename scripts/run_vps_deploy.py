import subprocess
import os

key_path = os.path.expanduser("~/.ssh/oracle_vps_key")
vps_host = "ubuntu@129.80.152.233"
local_script = "social_studio_app/scripts/remote_deploy.sh"

print("1. Uploading remote_deploy.sh to Oracle VPS...")
scp_cmd = [
    "scp",
    "-i", key_path,
    "-o", "StrictHostKeyChecking=no",
    local_script,
    f"{vps_host}:/home/ubuntu/remote_deploy.sh"
]
res = subprocess.run(scp_cmd, capture_output=True, text=True)
if res.returncode != 0:
    print("SCP Error:", res.stderr)
    exit(1)
print("Uploaded successfully!")

print("2. Executing remote_deploy.sh on Oracle VPS...")
ssh_cmd = [
    "ssh",
    "-i", key_path,
    "-o", "StrictHostKeyChecking=no",
    vps_host,
    "chmod +x /home/ubuntu/remote_deploy.sh && /home/ubuntu/remote_deploy.sh"
]
p = subprocess.Popen(ssh_cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding="utf-8", errors="replace")
for line in p.stdout:
    print(line, end="")
p.wait()
print(f"Finished with return code: {p.returncode}")
