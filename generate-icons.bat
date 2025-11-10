@echo off
echo Generating placeholder icons for Tauri...
echo.
echo Note: This creates minimal placeholder icons.
echo For production, please use proper icon files.
echo.

REM Create icons directory if it doesn't exist
if not exist "src-tauri\icons" mkdir "src-tauri\icons"

REM Use Tauri CLI to generate icons (requires a source icon.png)
echo You can generate proper icons using:
echo npx @tauri-apps/cli icon path/to/your/icon.png
echo.
echo Or download icon files and place them in src-tauri\icons\
echo Required files:
echo - 32x32.png
echo - 128x128.png
echo - 128x128@2x.png
echo - icon.icns (macOS)
echo - icon.ico (Windows)
echo.
pause
