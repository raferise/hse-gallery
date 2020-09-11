@echo off

setlocal EnableDelayedExpansion
SET i=0
FOR /F "tokens=*" %%A IN ('dir .\images /B /ON') DO SET /A i =!i!+1
echo Found %i% images already existing. Ready to upload. NOTE: All files in /upload/ must be jp(e)g.
pause
SET s=%i%
FOR /F "tokens=*" %%h IN ('dir .\upload /B /ON') do (
 move ".\upload\%%h" ".\images\!i!.jpg"
 set /a i=!i!+1
)
echo %i%>images.txt
echo Files moved and renamed. %s% %i%
py thumbs.py %s% %i%
endlocal
pause