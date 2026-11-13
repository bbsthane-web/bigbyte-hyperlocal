import subprocess
import os
import sys

key_path = os.path.expanduser("~/.ssh/oracle_vps_key")
vps_host = "ubuntu@129.80.152.233"

remote_commands = """
set -e
echo "=== STEP 1: Setting up Social Studio repository on VPS ==="
if [ ! -d "/home/ubuntu/social_studio/.git" ]; then
    rm -rf /home/ubuntu/social_studio
    git clone -b social-studio https://github.com/bbsthane-web/bigbyte-hyperlocal.git /home/ubuntu/social_studio
else
    cd /home/ubuntu/social_studio
    git fetch origin social-studio
    git checkout social-studio
    git reset --hard origin/social-studio
fi

echo "=== STEP 2: Installing production dependencies ==="
cd /home/ubuntu/social_studio
npm install --omit=dev

echo "=== STEP 3: Registering and Launching under PM2 ==="
pm2 delete social-studio 2>/dev/null || true
PORT=3000 pm2 start server.js --name "social-studio" --time
pm2 save

echo "=== STEP 4: Verifying local port 3000 ==="
sleep 2
curl -s -I http://127.0.0.1:3000/crm/ | head -n 5

echo "=== STEP 5: Updating Nginx configuration for Social Studio routing ==="
sudo cat << 'EOF' | sudo tee /etc/nginx/sites-available/default > /dev/null
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html index.htm;

    server_name _;

    # Main Static Website
    location / {
        try_files $uri $uri/ =404;
    }

    # Social Studio App: CRM Dashboard
    location /crm/ {
        proxy_pass http://127.0.0.1:3000/crm/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Social Studio App: Pitch Deck
    location /pitch/ {
        proxy_pass http://127.0.0.1:3000/pitch/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Social Studio App: REST APIs
    location /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Social Studio Command Center
    location /social/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location = /whatsapp {
        return 302 https://wa.me/919167463807?text=Hi%20Big%20Byte%20Systems,%20I%20am%20interested%20in%20the%20Social%20Media%20Pilot;
    }
}
EOF

sudo nginx -t
sudo systemctl reload nginx
echo "=== STEP 6: Testing Nginx reverse proxy to CRM ==="
curl -s -I http://127.0.0.1/crm/ | head -n 5
curl -s -I http://127.0.0.1/pitch/ | head -n 5

echo "=== DEPLOYMENT COMPLETE ==="
pm2 status
"""

cmd = [
    "ssh",
    "-n",
    "-T",
    "-i", key_path,
    "-o", "StrictHostKeyChecking=no",
    "-o", "ConnectTimeout=10",
    vps_host,
    f"bash -c {subprocess.list2cmdline([remote_commands])}"
]

print("Starting Oracle VPS deployment...")
p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding="utf-8", errors="replace")
for line in p.stdout:
    print(line, end="")
p.wait()
print(f"Finished with return code: {p.returncode}")
