@echo off
setlocal enabledelayedexpansion
chcp 65001
:baixar
cls
echo Baixando tópicos...
for /F %%A in ('curl -s https://1500chan.org/b/threads.json ^| jq .[].threads[].no') do (
	::curl -s https://1500chan.org/b/res/%%A.json | jq [.posts[].com_nomarkup] | gzip -f -9>threads\%%A.json.gz
	curl -s https://1500chan.org/b/res/%%A.json | jq [.posts[].com_nomarkup] >%temp%\%%A.json 2> nul
	echo %%A: !errorlevel!:%errorlevel%
	if !errorlevel!==0 move /y %temp%\%%A.json threads 1> nul 2> nul
	del /q %temp%\%%A.json 1> nul 2> nul
)
echo.
timeout 3600
goto :baixar