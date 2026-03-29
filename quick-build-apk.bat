@echo off
chcp 65001 >nul 2>&1
echo.
echo ==============================
echo   Quick APK Build (Gradle Only)
echo ==============================
echo.

set "ANDROID_DIR=%~dp0android"
set "OUTPUT_DIR=%~dp0apk-output"

if not exist "%ANDROID_DIR%" (
    echo [ERROR] android folder not found! Run build-local-apk.bat first.
    pause
    exit /b 1
)

cd /d "%ANDROID_DIR%"

echo [BUILD] Building Debug APK...
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo [ERROR] Build failed!
    cd /d "%~dp0"
    pause
    exit /b 1
)

if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

set "APK=%ANDROID_DIR%\app\build\outputs\apk\debug\app-debug.apk"
if exist "%APK%" (
    copy "%APK%" "%OUTPUT_DIR%\ExpenseManager-debug.apk" >nul
    echo.
    echo [DONE] APK saved to: %OUTPUT_DIR%\ExpenseManager-debug.apk
) else (
    echo [WARN] APK not found at expected location.
    for /r "%ANDROID_DIR%\app\build\outputs\apk" %%f in (*.apk) do (
        echo   Found: %%f
    )
)

cd /d "%~dp0"
echo.
pause
