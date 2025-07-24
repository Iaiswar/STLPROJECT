
@echo off
echo Starting all services...

:: Start client.py
start cmd /k "cd /d %~dp0client_socket && python client.py"

:: Start server.py
start cmd /k "cd /d %~dp0server_socket && python server.py"

:: Start Django backend
start cmd /k "cd /d %~dp0IJLBackend && python manage.py runserver"

:: Start React frontend (Vite or Next)
start cmd /k "cd /d %~dp0dojo && npm run dev"

echo All services started.
