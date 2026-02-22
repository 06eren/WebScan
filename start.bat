@echo off
set ELECTRON_RUN_AS_NODE=
echo ELECTRON_RUN_AS_NODE is now: [%ELECTRON_RUN_AS_NODE%]
node_modules\electron\dist\electron.exe . 2>&1
