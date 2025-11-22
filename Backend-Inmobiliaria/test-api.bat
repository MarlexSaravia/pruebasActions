@echo off
echo ========================================
echo PROBANDO API - Inmobiliaria San Felipe
echo ========================================
echo.

echo 1. Health Check...
curl -s http://localhost:3000/api/health
echo.
echo.

echo 2. Login como MODERADOR (admin)...
curl -s -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"Admin123456\"}"
echo.
echo.

echo 3. Login como ADMIN_OBRA (jorge)...
curl -s -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"jorge\",\"password\":\"123456\"}"
echo.
echo.

echo 4. Login como TRABAJADOR (gian)...
curl -s -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"gian\",\"password\":\"123456\"}"
echo.
echo.

echo ========================================
echo PRUEBAS COMPLETADAS
echo ========================================
pause
