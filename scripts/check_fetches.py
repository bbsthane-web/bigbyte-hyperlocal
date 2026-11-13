with open('social_studio_app/public/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
fetches = re.findall(r'fetch\([\'"`]([^\'"`]+)[\'"`]', text)
print('Fetch endpoints in index.html:')
for ep in sorted(set(fetches)):
    print('  ', ep)
