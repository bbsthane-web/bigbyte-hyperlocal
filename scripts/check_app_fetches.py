with open('social_studio_app/public/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
fetches = re.findall(r'fetch\([\'"`]([^\'"`]+)[\'"`]', text)
print('API calls in app.js:')
for ep in sorted(set(fetches)):
    print('  ', ep)
