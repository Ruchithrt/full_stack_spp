import httpx
from fastapi import FastAPI, Request
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="API Gateway")

SERVICES = {
    "products":  "http://product-service:8002",
    "suppliers": "http://supplier-service:8001",
}

# CORS only needed here now — browser talks only to the gateway
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.api_route("/{service}/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def gateway(service: str, path: str, request: Request):
    base_url = SERVICES.get(service)

    if not base_url:
        return Response(content=f"Unknown service: {service}", status_code=404)

    url = f"{base_url}/{service}/{path}"

    async with httpx.AsyncClient() as client:
        response = await client.request(
            method=request.method,
            url=url,
            content=await request.body(),
            params=request.query_params,
            headers={"Content-Type": "application/json"},
        )

    return Response(
        content=response.content,
        status_code=response.status_code,
        media_type=response.headers.get("content-type"),
    )