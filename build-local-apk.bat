@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

echo ============================================
echo   Expense Manager App - Local APK Builder
echo ============================================
echo.

set "PROJECT_DIR=%~dp0"
set "ANDROID_DIR=%PROJECT_DIR%android"

:: Step 1: Check prerequisites
echo [STEP 1] Checking prerequisites...

java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java/JDK not found! Install JDK 17 and add to PATH.
    pause
    exit /b 1
)

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found! Install Node.js and add to PATH.
    pause
    exit /b 1
)

echo [OK] All prerequisites found.
echo.

:: Step 2: Install dependencies
echo [STEP 2] Installing npm dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install failed!
    pause
    exit /b 1
)
echo [OK] Dependencies installed.
echo.

:: Step 3: Export JS bundle
echo [STEP 3] Creating JS bundle for Android...
set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "PATH=%JAVA_HOME%\bin;%PATH%"
set NODE_ENV=production
call npx expo export --platform android --output-dir android/app/src/main/assets
if %errorlevel% neq 0 (
    echo [ERROR] JS bundle export failed!
    pause
    exit /b 1
)
echo [OK] JS bundle created.
echo.

:: Step 4: Build Debug APK
echo [STEP 4] Building Debug APK...
cd /d "%ANDROID_DIR%"
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo [ERROR] Debug APK build failed!
    cd /d "%PROJECT_DIR%"
    pause
    exit /b 1
)
cd /d "%PROJECT_DIR%"
echo [OK] Debug APK built successfully.
echo.

:: Step 5: Copy APKs to output folder
echo [STEP 5] Copying APK files to output folder...
set "OUTPUT_DIR=%PROJECT_DIR%apk-output"
if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

set "DEBUG_APK=%ANDROID_DIR%\app\build\outputs\apk\debug\app-debug.apk"

if exist "%DEBUG_APK%" (
    copy "%DEBUG_APK%" "%OUTPUT_DIR%\ExpenseManager-debug.apk" >nul
    echo [OK] Debug APK: %OUTPUT_DIR%\ExpenseManager-debug.apk
)

echo.
echo ============================================
echo   BUILD COMPLETE!
echo ============================================
echo.
echo APK: %OUTPUT_DIR%\ExpenseManager-debug.apk
echo.
echo Install on device:
echo   adb install "%OUTPUT_DIR%\ExpenseManager-debug.apk"
echo ============================================
echo.
pause
