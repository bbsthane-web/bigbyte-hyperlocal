import urllib.request
import urllib.parse
import re

url = 'https://most-earned-bits-question.trycloudflare.com/social/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8', errors='replace')
    print('HTML Length:', len(html))
    assets = re.findall(r'(?:src|href)=["\']([^"\']+\.(?:js|css|png|jpg|svg))["\']', html)
    print(f'Total assets found in index.html: {len(assets)}')
    for a in set(assets):
        test_url = urllib.parse.urljoin(url, a)
        try:
            r = urllib.request.urlopen(urllib.request.Request(test_url, headers={'User-Agent': 'Mozilla/5.0'}))
            print(f'  [200 OK] {a} -> {test_url}')
        except Exception as e:
            print(f'  [FAIL {e}] {a} -> {test_url}')
except Exception as ex:
    print('Failed to fetch /social/:', ex)
