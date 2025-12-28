#!/bin/bash

# Function to remove emojis from a file
remove_emojis() {
    local file="$1"
    # Remove common AI-detecting emojis
    sed -i 's/🚀//g' "$file"
    sed -i 's/✅//g' "$file"
    sed -i 's/❌//g' "$file"
    sed -i 's/⚠️//g' "$file"
    sed -i 's/📝//g' "$file"
    sed -i 's/🔒//g' "$file"
    sed -i 's/🔐//g' "$file"
    sed -i 's/💾//g' "$file"
    sed -i 's/📦//g' "$file"
    sed -i 's/🌐//g' "$file"
    sed -i 's/⛓️//g' "$file"
    sed -i 's/💰//g' "$file"
    sed -i 's/🎯//g' "$file"
    sed -i 's/📊//g' "$file"
    sed -i 's/🛡️//g' "$file"
    sed -i 's/✨//g' "$file"
    sed -i 's/🔧//g' "$file"
    sed -i 's/⚙️//g' "$file"
    sed -i 's/🔑//g' "$file"
    sed -i 's/💡//g' "$file"
    sed -i 's/🎨//g' "$file"
    sed -i 's/📱//g' "$file"
    sed -i 's/🖥️//g' "$file"
    sed -i 's/🗂️//g' "$file"
    sed -i 's/📂//g' "$file"
    sed -i 's/🔄//g' "$file"
    sed -i 's/⏱️//g' "$file"
    sed -i 's/🎁//g' "$file"
    sed -i 's/🌟//g' "$file"
    # Remove any remaining emoji space patterns
    sed -i 's/ *$//' "$file"
}

# Move blockchain documentation
mv BLOCKCHAIN_COMPLETE_GUIDE.md docs/blockchain/ 2>/dev/null
mv BLOCKCHAIN_IMPLEMENTATION_SUMMARY.md docs/blockchain/ 2>/dev/null
mv BLOCKCHAIN_PAYMENT_SETUP.md docs/blockchain/ 2>/dev/null
mv BLOCKCHAIN_QUICK_START.md docs/blockchain/ 2>/dev/null
mv BLOCKCHAIN_SETUP.md docs/blockchain/ 2>/dev/null

# Move database documentation
mv DATABASE_SETUP.md docs/database/ 2>/dev/null

# Move setup documentation
mv SETUP_GUIDE.md docs/setup/ 2>/dev/null
mv QUICK_START.md docs/setup/ 2>/dev/null
mv START_SERVICES.sh docs/setup/ 2>/dev/null

# Move deployment documentation
mv DEPLOYMENT_STATUS.md docs/deployment/ 2>/dev/null
mv GITHUB_DEPLOYMENT_COMPLETE.md docs/deployment/ 2>/dev/null
mv GITHUB_SETUP.md docs/deployment/ 2>/dev/null
mv GIT_PUSH_CHECKLIST.md docs/deployment/ 2>/dev/null

# Move other documentation
mv PROJECT_SUMMARY.md docs/ 2>/dev/null
mv PRODUCTION_READY.md docs/ 2>/dev/null
mv NEXT_STEPS.md docs/ 2>/dev/null
mv ESEWA_INTEGRATION_FIX.md docs/ 2>/dev/null
mv COMPLETE_SYSTEM.md docs/ 2>/dev/null
mv README_BACKEND.md docs/ 2>/dev/null

# Remove emojis from all markdown files
echo "Removing emojis from documentation..."
for file in docs/**/*.md docs/*.md; do
    if [ -f "$file" ]; then
        echo "Cleaning: $file"
        remove_emojis "$file"
    fi
done

echo "File organization complete!"
