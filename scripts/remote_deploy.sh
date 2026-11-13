#!/usr/bin/env bash
set -e

echo "=== [1/6] CLONING / UPDATING SOCIAL STUDIO REPO ==="
if [ ! -d "/home/ubuntu/social_studio/.git" ]; then
    rm -rf /home/ubuntu/social_studio
    git clone -b social-studio https://github.com/bbsthane-web/bigbyte-hyperlocal.git /home/ubuntu/social_studio
else
    cd /home/ubuntu/social_studio
    git fetch origin social-studio
    git checkout social-studio
    git reset --hard origin/social-studio
fi

echo "=== [2/6] INSTALLING NPM DEPENDENCIES ==="
cd /home/ubuntu/social_studio
npm install --omit=dev

echo "=== [3/6] STARTING SERVER UNDER PM2 ==="
pm2 delete social-studio 2>/dev/null || true
PORT=3000 pm2 start server.js --name "social-studio"
pm2 save

echo "=== [4/6] VERIFYING LOCAL PORT 3000 ==="
sleep 2
curl -I http://127.0.0.1:3000/crm/ | head -n 5

echo "=== [5/6] UPDATING NGINX REVERSE PROXY ==="
sudo tee /etc/nginx/sites-available/default > /dev/null << 'EOF'
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
    location ^~ /crm {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Social Studio App: Pitch Deck
    location ^~ /pitch {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Social Studio App: REST APIs
    location ^~ /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Social Studio Command Center (/social/ and /studio/)
    location ^~ /social/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location = /social {
        return 301 /social/;
    }

    location ^~ /studio/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location = /studio {
        return 301 /studio/;
    }

    # Product Portal & Testing Hub (/portal/ and /hub/)
    location ^~ /portal/ {
        proxy_pass http://127.0.0.1:3000/portal/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location = /portal {
        return 301 /portal/;
    }

    location ^~ /hub/ {
        proxy_pass http://127.0.0.1:3000/portal/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location = /hub {
        return 301 /hub/;
    }

    # Access & Login Gateway (/login/)
    location ^~ /login/ {
        proxy_pass http://127.0.0.1:3000/login/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location = /login {
        return 301 /login/;
    }

    # Tester Feedback Dashboard (/feedback/)
    location ^~ /feedback/ {
        proxy_pass http://127.0.0.1:3000/feedback/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location = /feedback {
        return 301 /feedback/;
    }

    location = /whatsapp {
        return 302 https://wa.me/919167463807?text=Hi%20Big%20Byte%20Systems,%20I%20am%20interested%20in%20the%20Social%20Media%20Pilot;
    }
}
EOF

sudo nginx -t
sudo systemctl reload nginx

echo "=== [6/6] HEALTH CHECKS VIA NGINX ==="
curl -I http://127.0.0.1/portal/ | head -n 5
curl -I http://127.0.0.1/login/ | head -n 5
curl -I http://127.0.0.1/feedback/ | head -n 5
curl -I http://127.0.0.1/crm/ | head -n 5
curl -I http://127.0.0.1/pitch/ | head -n 5
curl -I http://127.0.0.1/api/leads | head -n 5

echo "=== DEPLOYMENT COMPLETED SUCCESSFULLY ==="
pm2 status
