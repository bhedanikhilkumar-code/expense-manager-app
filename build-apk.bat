@echo off
echo [INFO] Starting APK Build Process for Expense Manager App...
echo [STEP 1] Checking if EAS CLI is installed...
call npx eas --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] EAS CLI is not installed. Installing...
    call npm install -g eas-cli
    if errorlevel 1 (
        echo [ERROR] Failed to install eas-cli. Aborting.
        exit /b 1
    )
    where eas >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] eas executable not found after installation. Aborting.
        exit /b 1
    )
)

echo [STEP 2] Starting Android Build (Profile: preview)...
echo [NOTE] If it asks to login, please follow the instructions in the terminal.
call npx eas build --platform android --profile preview
if errorlevel 1 (
    echo.
    echo [ERROR] Build failed! Please check the output above for details.
    pause
    exit /b 1
)

echo.
echo [DONE] Build request sent! Please wait for the process to finish on Expo's servers.
echo You will receive a link to download your APK file.
pause
