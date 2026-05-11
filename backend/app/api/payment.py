import json
import uuid
import hmac
import hashlib
import httpx
from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from typing import Any, Dict

router = APIRouter(prefix="/payment", tags=["Payment"])

MOMO_PARTNER_CODE = "MOMOBKUN20180529"
MOMO_ACCESS_KEY = "klm05TvNBzhg7h7j"
MOMO_SECRET_KEY = b"at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa"
MOMO_ENDPOINT = "https://test-payment.momo.vn/v2/gateway/api/create"

class MomoPaymentRequest(BaseModel):
    amount: int
    order_info: str
    return_url: str
    notify_url: str

@router.post("/momo")
async def create_momo_payment(request: MomoPaymentRequest):
    order_id = str(uuid.uuid4())
    request_id = str(uuid.uuid4())
    
    amount = str(request.amount)
    order_info = request.order_info
    return_url = request.return_url
    notify_url = request.notify_url
    
    raw_signature = f"accessKey={MOMO_ACCESS_KEY}&amount={amount}&extraData=&ipnUrl={notify_url}&orderId={order_id}&orderInfo={order_info}&partnerCode={MOMO_PARTNER_CODE}&redirectUrl={return_url}&requestId={request_id}&requestType=captureWallet"
    
    h = hmac.new(MOMO_SECRET_KEY, raw_signature.encode('utf-8'), hashlib.sha256)
    signature = h.hexdigest()
    
    data = {
        "partnerCode": MOMO_PARTNER_CODE,
        "partnerName": "Test",
        "storeId": "MomoTestStore",
        "requestId": request_id,
        "amount": request.amount,
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
        result = response.json()
        
        if result.get("resultCode") == 0:
            return {"payUrl": result.get("payUrl")}
        else:
            raise HTTPException(status_code=400, detail=result.get("message", "Momo payment failed"))
