@echo off
echo ====================================
echo   CREATION DE L'APPLICATION ELECTRON
echo   Gestion Scolaire - Ecole Roseraie
echo ====================================
echo.

echo [1/4] Installation des dependances principales...
call npm install
if errorlevel 1 (
    echo ERREUR: Installation des dependances echouee
    pause
    exit /b 1
)

echo.
echo [2/4] Construction de l'application web...
call npm run build
if errorlevel 1 (
    echo ERREUR: Construction de l'app web echouee
    pause
    exit /b 1
)

echo.
echo [3/4] Installation d'Electron...
cd electron
call npm install
if errorlevel 1 (
    echo ERREUR: Installation d'Electron echouee
    pause
    exit /b 1
)

echo.
echo [4/4] Creation de l'executable (.exe)...
call npm run build
if errorlevel 1 (
    echo ERREUR: Creation de l'executable echouee
    pause
    exit /b 1
)

echo.
echo ====================================
echo   CREATION TERMINEE AVEC SUCCES !
echo ====================================
echo.
echo L'installateur se trouve dans:
echo electron\dist-electron\
echo.
echo Fichier a copier sur la cle USB:
echo "Gestion Scolaire Roseraie Setup 1.0.0.exe"
echo.
pause