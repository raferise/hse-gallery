@echo off

setlocal EnableDelayedExpansion
SET i=0
FOR /F "tokens=*" %%A IN ('dir .\images /B') DO SET /A i =!i!+1
echo Found %i% images already existing. Ready to upload. NOTE: All files in /upload/ must be jp(e)g.
pause

FOR /F "tokens=*" %%h IN ('dir .\upload /B') do (
 move .\upload\%%h .\images\!i!.jpg
 set /a i=!i!+1
)
endlocal
echo Files moved and renamed!
pause