@echo off
echo [INFO] Starting APK Build Process for Expense Manager App...
echo [STEP 1] Checking if EAS CLI is installed...
call npx eas --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] EAS CLI is not installed. Installing...
    call npm install -g eas-cli
)

echo [STEP 2] Starting Android Build (Profile: preview)...
echo [NOTE] If it asks to login, please follow the instructions in the terminal.
npx eas build --platform android --profile preview

echo.
echo [DONE] Build request sent! Please wait for the process to finish on Expo's servers.
echo You will receive a link to download your APK file.
pause
