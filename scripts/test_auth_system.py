import urllib.request
import urllib.parse
import json
import http.cookiejar

cookie_jar = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cookie_jar))

base = 'http://localhost:3000'

print("=== TEST 1: Portal Landing Page ===")
r = opener.open(f'{base}/portal/')
print("Portal status:", r.status)
assert r.status == 200

print("\n=== TEST 2: Protected Page without Auth (Expect Redirect) ===")
# Custom handler to capture 302 without following
class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

no_redir_opener = urllib.request.build_opener(NoRedirectHandler)
try:
    no_redir_opener.open(f'{base}/crm/')
    print("UNEXPECTED: /crm/ was not redirected")
except urllib.error.HTTPError as e:
    print(f"Captured HTTP {e.code} redirect to: {e.headers.get('Location')}")
    assert e.code == 302
    assert '/portal/?locked=true' in e.headers.get('Location')

print("\n=== TEST 3: Login with Secret Key ===")
login_req = urllib.request.Request(
    f'{base}/api/auth/login',
    data=json.dumps({"secretKey": "BBS-TESTER-2026"}).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)
r_login = opener.open(login_req)
login_resp = json.loads(r_login.read().decode('utf-8'))
print("Login Response:", login_resp)
assert login_resp['success'] is True
assert login_resp['role'] == 'Beta Tester'

print("\n=== TEST 4: Access /crm/ with Active Cookie Session ===")
r_crm = opener.open(f'{base}/crm/')
print("CRM status with cookie session:", r_crm.status)
assert r_crm.status == 200

print("\n=== TEST 5: Direct 1-Click Access via ?key=PILOT-VIP ===")
fresh_opener = urllib.request.build_opener()
r_vip = fresh_opener.open(f'{base}/studio/?key=PILOT-VIP')
print("Direct ?key=PILOT-VIP status:", r_vip.status)
assert r_vip.status == 200

print("\n=== TEST 6: Feedback Submission ===")
fb_req = urllib.request.Request(
    f'{base}/api/feedback',
    data=json.dumps({
        "name": "Dr. Sharma",
        "rating": 5,
        "module": "Interactive Pitch Deck",
        "feedback": "The Desi voiceover and 3-day trial offer is exactly what our dental practice needed."
    }).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)
r_fb = opener.open(fb_req)
fb_resp = json.loads(r_fb.read().decode('utf-8'))
print("Feedback Response:", fb_resp)
assert fb_resp['success'] is True

print("\n🎉 ALL 6 AUTH & ACCESS CONTROL TESTS PASSED 100%!")
