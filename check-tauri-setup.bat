@echo off
echo ================================================
echo Vehicle Architecture Designer - Tauri Setup Check
echo ================================================
echo.

REM Check Node.js
echo [1/3] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from https://nodejs.org/
    goto :error
) else (
    node --version
    echo OK: Node.js found
)
echo.

REM Check Rust
echo [2/3] Checking Rust...
rustc --version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Rust not found!
    echo Tauri requires Rust. Install from https://rustup.rs/
    echo.
    echo After installing Rust, run:
    echo   rustup default stable
    echo.
    goto :error
) else (
    rustc --version
    echo OK: Rust found
)
echo.

REM Check if npm packages are installed
echo [3/3] Checking npm packages...
if not exist "node_modules" (
    echo WARNING: node_modules not found
    echo Please run: npm install
    goto :error
) else (
    echo OK: npm packages installed
)
echo.

echo ================================================
echo All prerequisites met! You can now run:
echo.
echo   npm run tauri:dev     - Run in development mode
echo   npm run tauri:build   - Build desktop application
echo ================================================
pause
exit /b 0

:error
echo.
echo ================================================
echo Setup incomplete. Please fix the errors above.
echo ================================================
pause
exit /b 1
