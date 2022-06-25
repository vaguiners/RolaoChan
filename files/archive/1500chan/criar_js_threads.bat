@echo off
setlocal enabledelayedexpansion
cd threads
set base=0
for %%s in (*.json) do (
	set thread=%%s
	set thread=!thread:.json=!
	set /a thread=!thread!-!base!
	set /a base=!base!+!thread!
	echo !thread! >> ..\topicos.js
)
cd ..
tr -d " " < topicos.js >> topicos2.js
del /q topicos.js
tr '\r\n' ',' < topicos2.js > topicos3.js
del /q topicos2.js
tr -d "'" < topicos3.js > topicos4.js
del /q topicos3.js

pause