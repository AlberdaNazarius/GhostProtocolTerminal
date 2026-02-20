# Ghost Protocol Terminal - Single Command Startup
# Assumes: Bun installed, Node.js installed, npm available

Write-Host "[GHOST_PROTOCOL] Initializing systems..." -ForegroundColor Green

# Check prerequisites
if (-not (Get-Command bun -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Bun not found. Install from https://bun.sh" -ForegroundColor Red
    exit 1
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js not found. Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Install dependencies if needed
if (-not (Test-Path "backend/node_modules")) {
    Write-Host "[BACKEND] Installing dependencies..." -ForegroundColor Yellow
    Set-Location backend
    bun install
    Set-Location ..
}

if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "[FRONTEND] Installing dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
}

# Start backend in background
Write-Host "[BACKEND] Launching server on port 3001..." -ForegroundColor Cyan
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendJob = Start-Job -ScriptBlock {
    param($path)
    Set-Location $path
    Set-Location backend
    bun run src/index.ts
} -ArgumentList $scriptPath

# Wait for backend to start
Start-Sleep -Seconds 2

# Start frontend
Write-Host "[FRONTEND] Launching client on port 3000..." -ForegroundColor Cyan
Set-Location frontend
npm run dev

# Cleanup on exit
Register-EngineEvent PowerShell.Exiting -Action {
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob -ErrorAction SilentlyContinue
}
