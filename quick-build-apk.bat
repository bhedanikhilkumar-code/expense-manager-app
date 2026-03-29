@echo off
chcp 65001 >nul 2>&1
echo.
echo ==============================
echo   Quick APK Build
echo ==============================
echo.

set "PROJECT_DIR=%~dp0"
set "ANDROID_DIR=%PROJECT_DIR%android"
set "OUTPUT_DIR=%PROJECT_DIR%apk-output"

if not exist "%ANDROID_DIR%" (
    echo [ERROR] android folder not found! Run build-local-apk.bat first.
    pause
    exit /b 1
)

set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo [STEP 1] Creating JS bundle...
set NODE_ENV=production
call npx expo export --platform android --output-dir android\app\src\main\assets
if %errorlevel% neq 0 (
    echo [ERROR] JS bundle export failed!
    pause
    exit /b 1
)

echo.
echo [STEP 2] Building Debug APK...
cd /d "%ANDROID_DIR%"
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo [ERROR] Build failed!
    cd /d "%PROJECT_DIR%"
    pause
    exit /b 1
)

if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

set "APK=%ANDROID_DIR%\app\build\outputs\apk\debug\app-debug.apk"
if exist "%APK%" (
    copy "%APK%" "%OUTPUT_DIR%\ExpenseManager-debug.apk" >nul
    echo.
    echo [DONE] APK saved to: %OUTPUT_DIR%\ExpenseManager-debug.apk
)

cd /d "%PROJECT_DIR%"
echo.
pause
