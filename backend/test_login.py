import urllib.request
import urllib.parse

data = urllib.parse.urlencode({
    'username': 'admin@hotel.com',
    'password': 'admin123'
}).encode()

req = urllib.request.Request('http://localhost:8000/api/auth/login', data=data)

try:
    resp = urllib.request.urlopen(req)
    print(resp.read().decode())
except Exception as e:
    if hasattr(e, 'read'):
        print(e.read().decode())
    else:
        print(e)
