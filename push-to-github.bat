@echo off
echo =======================================================
echo   LOVE HINGU PORTFOLIO - GITHUB UPLOAD AUTOMATION
echo =======================================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Git is not found on your system.
    echo [*] Installing Git automatically via winget...
    winget install --id Git.Git -e --source winget
    echo.
    echo [*] Git installed! Please close and reopen this window,
    echo     then run push-to-github.bat again.
    pause
    exit /b
)

echo [*] Initializing Git repository...
git init
git branch -M main

echo [*] Configuring remote origin (https://github.com/lvhinguroot-08/portfolio.git)...
git remote remove origin 2>nul
git remote add origin https://github.com/lvhinguroot-08/portfolio.git

echo [*] Staging all files...
git add .

echo [*] Creating commit...
git commit -m "feat: complete immersive 3D cyber security portfolio for Love Hingu"

echo.
echo [*] Pushing to GitHub main branch...
echo [*] (If prompted, please sign in to GitHub in the browser popup)...
git push -u origin main --force

echo.
echo =======================================================
echo   [SUCCESS] Code successfully pushed to GitHub!
echo =======================================================
pause

