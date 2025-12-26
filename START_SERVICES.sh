#!/bin/bash
# Quick start script for BUYSEWA Platform

echo "🚀 Starting BUYSEWA E-commerce Platform..."
echo ""

# Check if services are already running
check_port() {
    lsof -ti:$1 > /dev/null 2>&1
}

# Start Hardhat Node (if not running)
if ! check_port 8545; then
    echo "📦 Starting Hardhat node..."
    cd "$(dirname "$0")"
    npm pkg set type="module" > /dev/null 2>&1
    npx hardhat node > /tmp/hardhat.log 2>&1 &
    sleep 8
    echo "✅ Hardhat node started on http://localhost:8545"
    
    # Deploy contract
    echo "📝 Deploying smart contract..."
    CONTRACT_OUTPUT=$(npx hardhat run scripts/deploy.js --network localhost 2>&1)
    CONTRACT_ADDR=$(echo "$CONTRACT_OUTPUT" | grep -oP '0x[a-fA-F0-9]{40}' | head -1)
    
    if [ ! -z "$CONTRACT_ADDR" ]; then
        echo "✅ Contract deployed: $CONTRACT_ADDR"
        # Update .env
        cd review-backend
        sed -i "s|REVIEW_AUTH_CONTRACT_ADDRESS=.*|REVIEW_AUTH_CONTRACT_ADDRESS=$CONTRACT_ADDR|" .env
        PRIVATE_KEY=$(grep -A 20 "Account #0" /tmp/hardhat.log 2>/dev/null | grep "Private Key" | head -1 | awk '{print $3}')
        if [ ! -z "$PRIVATE_KEY" ]; then
            sed -i "s|BLOCKCHAIN_PRIVATE_KEY=.*|BLOCKCHAIN_PRIVATE_KEY=$PRIVATE_KEY|" .env
        fi
        cd ..
    fi
else
    echo "✅ Hardhat node already running"
fi

# Start Backend (if not running)
if ! check_port 5000; then
    echo "🔧 Starting backend server..."
    cd "$(dirname "$0")/review-backend"
    node server.js > /tmp/backend.log 2>&1 &
    sleep 3
    echo "✅ Backend started on http://localhost:5000"
    cd ..
else
    echo "✅ Backend already running"
fi

# Start Frontend (if not running)
if ! check_port 5173; then
    echo "🎨 Starting frontend server..."
    cd "$(dirname "$0")"
    npm run dev > /tmp/frontend.log 2>&1 &
    sleep 5
    echo "✅ Frontend started on http://localhost:5173"
else
    echo "✅ Frontend already running"
fi

echo ""
echo "=== ✅ ALL SERVICES RUNNING ==="
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:5000"
echo "⛓️  Hardhat:  http://localhost:8545"
echo ""
echo "📝 Logs:"
echo "  - Hardhat: /tmp/hardhat.log"
echo "  - Backend: /tmp/backend.log"
echo "  - Frontend: /tmp/frontend.log"
echo ""
echo "Press Ctrl+C to stop all services"


