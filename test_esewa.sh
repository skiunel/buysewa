#!/bin/bash
echo "🧪 Testing eSewa Integration..."
echo ""

echo "1. Testing health endpoint..."
curl -s http://localhost:5000/api/health | jq '.' || echo "❌ Backend not running"
echo ""

echo "2. Testing eSewa test endpoint..."
curl -s http://localhost:5000/api/esewa/test | jq '.' || echo "❌ eSewa routes not loaded"
echo ""

echo "3. Testing eSewa initiate endpoint..."
curl -X POST http://localhost:5000/api/esewa/initiate \
  -H "Content-Type: application/json" \
  -d '{"amount":1000,"orderId":"TEST-123"}' \
  -s | jq '.' || echo "❌ Initiate endpoint failed"
echo ""

echo "✅ Test complete!"
