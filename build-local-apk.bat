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

:: Check Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java/JDK not found! Install JDK 17+ and add to PATH.
    pause
    exit /b 1
)

:: Check Android SDK
if not exist "%ANDROID_HOME%" (
    if not exist "%LOCALAPPDATA%\Android\Sdk" (
        echo [ERROR] Android SDK not found! Set ANDROID_HOME or install Android Studio.
        pause
        exit /b 1
    )
)

:: Check Node.js
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

:: Step 3: Prebuild (generate/update native android project)
echo [STEP 3] Prebuilding Android project...
call npx expo prebuild --platform android --no-install
if %errorlevel% neq 0 (
    echo [WARN] Prebuild had issues, continuing with existing android folder...
)
echo [OK] Android project ready.
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

:: Step 5: Build Release APK (using debug signing for testing)
echo [STEP 5] Building Release APK (debug-signed)...
cd /d "%ANDROID_DIR%"
call gradlew.bat assembleRelease
if %errorlevel% neq 0 (
    echo [ERROR] Release APK build failed!
    cd /d "%PROJECT_DIR%"
    pause
    exit /b 1
)
cd /d "%PROJECT_DIR%"
echo [OK] Release APK built successfully.
echo.

:: Step 6: Copy APKs to output folder
echo [STEP 6] Copying APK files to output folder...
set "OUTPUT_DIR=%PROJECT_DIR%apk-output"
if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

set "DEBUG_APK=%ANDROID_DIR%\app\build\outputs\apk\debug\app-debug.apk"
set "RELEASE_APK=%ANDROID_DIR%\app\build\outputs\apk\release\app-release.apk"

if exist "%DEBUG_APK%" (
    copy "%DEBUG_APK%" "%OUTPUT_DIR%\ExpenseManager-debug.apk" >nul
    echo [OK] Debug APK: %OUTPUT_DIR%\ExpenseManager-debug.apk
) else (
    echo [WARN] Debug APK not found at expected location.
)

if exist "%RELEASE_APK%" (
    copy "%RELEASE_APK%" "%OUTPUT_DIR%\ExpenseManager-release.apk" >nul
    echo [OK] Release APK: %OUTPUT_DIR%\ExpenseManager-release.apk
) else (
    echo [WARN] Release APK not found at expected location.
)

:: Also search for any APK files in build output
echo.
echo [INFO] All APK files in build output:
for /r "%ANDROID_DIR%\app\build\outputs\apk" %%f in (*.apk) do (
    echo   - %%f
)

echo.
echo ============================================
echo   BUILD COMPLETE!
echo ============================================
echo.
echo APK files are in: %OUTPUT_DIR%
echo.
echo Debug APK:   ExpenseManager-debug.apk
echo Release APK: ExpenseManager-release.apk
echo.
echo To install on device:
echo   adb install "%OUTPUT_DIR%\ExpenseManager-debug.apk"
echo ============================================
echo.
pause
