import re

config_path = "/etc/nginx/sites-available/default"
with open(config_path, "r") as f:
    text = f.read()

# Remove any broken verify block
text = re.sub(r'\s*# Universal AI Search[\s\S]*?location = /verify\s*\{[\s\S]*?\}', '', text)

block = """
    # Universal AI Search & Google Business Verification Hub (/verify/)
    location ^~ /verify/ {
        proxy_pass http://127.0.0.1:3000/verify/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location = /verify {
        return 301 /verify/;
    }
"""

text = text.replace("    location ^~ /feedback/ {", block + "\n    location ^~ /feedback/ {")

with open("/tmp/nginx_clean.conf", "w") as f:
    f.write(text)
print("Updated /tmp/nginx_clean.conf successfully")
