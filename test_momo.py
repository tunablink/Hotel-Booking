import hmac
import hashlib
import uuid
import httpx
import asyncio

MOMO_PARTNER_CODE = "MOMOBKUN20180529"
MOMO_ACCESS_KEY = "klm05TvNBzhg7h7j"
MOMO_SECRET_KEY = b"at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa"
MOMO_ENDPOINT = "https://test-payment.momo.vn/v2/gateway/api/create"

async def test():
    order_id = str(uuid.uuid4())
    request_id = str(uuid.uuid4())
    amount = 50000
    order_info = "Test Payment"
    return_url = "http://localhost:5173/payment-return"
    notify_url = "http://localhost:5173/payment-return"
    
    raw_signature = f"accessKey={MOMO_ACCESS_KEY}&amount={amount}&extraData=&ipnUrl={notify_url}&orderId={order_id}&orderInfo={order_info}&partnerCode={MOMO_PARTNER_CODE}&redirectUrl={return_url}&requestId={request_id}&requestType=captureWallet"
    
    h = hmac.new(MOMO_SECRET_KEY, raw_signature.encode('utf-8'), hashlib.sha256)
    signature = h.hexdigest()
    
    data = {
        "partnerCode": MOMO_PARTNER_CODE,
        "partnerName": "Test",
        "storeId": "MomoTestStore",
        "requestId": request_id,
        "amount": amount,
        "orderId": order_id,
        "orderInfo": order_info,
        "redirectUrl": return_url,
        "ipnUrl": notify_url,
        "lang": "en",
        "extraData": "",
        "requestType": "captureWallet",
        "signature": signature
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(MOMO_ENDPOINT, json=data)
        print(response.text)

asyncio.run(test())
