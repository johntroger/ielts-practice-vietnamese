@echo off
title IELTS Writing Local Server
echo ======================================================
echo    DANG KHOI DONG IELTS WRITING ASSISTANT LOCAL...
echo ======================================================
cd /d "C:\Projects\IELTS Web"

:: Kiem tra neu port 3000 dang chay thi mo thang trinh duyet
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo Server da dang chay san tren port 3000.
    start http://localhost:3000
    exit
)

:: Neu chua chay, bat dau server va mo trinh duyet sau 2 giay
echo Dang khoi dong may chu Vite...
start /b cmd /c "npm run dev -- --port 3000"
timeout /t 3 /nobreak >nul
start http://localhost:3000
echo ======================================================
echo    UNG DUNG DA DUOC MO TREN TRINH DUYET!
echo    (De tat ung dung, ban chi can dong cua so nay)
echo ======================================================
pause
