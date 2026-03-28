# github-push.ps1
$ErrorActionPreference = "Stop"
cd "C:\Users\bheda\Music\Desktop\Gemini CLI\expense-manager-app"

Write-Host "====================================="
Write-Host "  Expense Manager App - GitHub Push  "
Write-Host "====================================="
Write-Host ""

Write-Host "1. Initializing Git repository (if not already done)..."
git init | Out-Null

Write-Host "2. Creating structured, logical commits..."

# Remove from index just in case anything was already staged
git reset | Out-Null

# Commit 1: Config
git add package.json package-lock.json app.json eas.json .gitignore
if ((git status --porcelain | Select-String -Pattern "^[A-Z]") -ne $null) {
    git commit -m "chore: initial project configuration and dependencies" | Out-Null
    Write-Host "  -> Committed configuration files."
}

# Commit 2: Assets
git add assets/
if ((git status --porcelain | Select-String -Pattern "^[A-Z]") -ne $null) {
    git commit -m "assets: add application icons and splash screens" | Out-Null
    Write-Host "  -> Committed assets (icons, splash screens)."
}

# Commit 3: Utilities and Context
git add src/utils/ src/context/
if ((git status --porcelain | Select-String -Pattern "^[A-Z]") -ne $null) {
    git commit -m "feat: add core utilities and state management context" | Out-Null
    Write-Host "  -> Committed utilities and context."
}

# Commit 4: Components
git add src/components/
if ((git status --porcelain | Select-String -Pattern "^[A-Z]") -ne $null) {
    git commit -m "feat: build reusable UI components (BalanceCard, StatItem, etc.)" | Out-Null
    Write-Host "  -> Committed UI components."
}

# Commit 5: Screens
git add src/screens/
if ((git status --porcelain | Select-String -Pattern "^[A-Z]") -ne $null) {
    git commit -m "feat: implement main application screens (Home, AddTransaction)" | Out-Null
    Write-Host "  -> Committed main screens."
}

# Commit 6: Entry Points
git add App.js index.js build-apk.bat
if ((git status --porcelain | Select-String -Pattern "^[A-Z]") -ne $null) {
    git commit -m "feat: setup app entry points and build scripts" | Out-Null
    Write-Host "  -> Committed entry points and build scripts."
}

# Commit 7: Documentation
git add README.md
if ((git status --porcelain | Select-String -Pattern "^[A-Z]") -ne $null) {
    git commit -m "docs: add comprehensive README with features and setup guide" | Out-Null
    Write-Host "  -> Committed README.md."
}

# Any remaining files
git add .
if ((git status --porcelain | Select-String -Pattern "^[A-Z]") -ne $null) {
    git commit -m "chore: add remaining miscellaneous files" | Out-Null
    Write-Host "  -> Committed remaining files."
}

Write-Host ""
Write-Host "All files have been committed with descriptive messages!"
Write-Host ""
Write-Host "3. Pushing to GitHub..."

# Rename branch to main
git branch -M main

# Check if gh CLI is installed
if (Get-Command gh -ErrorAction SilentlyContinue) {
    Write-Host "GitHub CLI (gh) detected. Attempting to create and push to a new repository..."
    try {
        # Check auth
        gh auth status 2>$null
        
        # Create repo and push
        gh repo create expense-manager-app --public --source=. --remote=origin --push
        $username = "bhedanikhilkumar-code"
        $repoUrl = "https://github.com/$username/expense-manager-app"
        Write-Host ""
        Write-Host "====================================="
        Write-Host " SUCCESS! Successfully pushed code."
        Write-Host " GitHub URL: $repoUrl"
        Write-Host "====================================="
    } catch {
        Write-Host "Error creating or pushing repository using GitHub CLI. Make sure you are logged in (run 'gh auth login')."
    }
} else {
    Write-Host "GitHub CLI (gh) not found on your system."
    Write-Host "Please create a new repository manually on GitHub (https://github.com/new) named 'expense-manager-app'."
    Write-Host "Then, run the following commands in this folder to push your code:"
    Write-Host ""
    Write-Host "  git remote add origin https://github.com/bhedanikhilkumar-code/expense-manager-app.git"
    Write-Host "  git push -u origin main"
    Write-Host ""
}
