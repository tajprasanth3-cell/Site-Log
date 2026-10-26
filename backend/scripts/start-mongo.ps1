$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$dataDir = Join-Path $projectRoot 'storage\mongo_data'
$logDir = Join-Path $projectRoot 'storage\mongo_logs'
$logFile = Join-Path $logDir 'mongod.log'
$mongod = Join-Path $env:LOCALAPPDATA 'Sitelog\mongodb\bin\mongod.exe'

$listener = Get-NetTCPConnection -LocalPort 27017 -State Listen -ErrorAction SilentlyContinue
if ($listener) {
  Write-Host "MongoDB is already running on 127.0.0.1:27017 (PID $($listener.OwningProcess))."
  exit 0
}

if (-not (Test-Path $mongod)) {
  throw "MongoDB binary not found at $mongod. Install MongoDB or update the local path."
}

New-Item -ItemType Directory -Force -Path $dataDir, $logDir | Out-Null

$process = Start-Process -FilePath $mongod `
  -ArgumentList '--dbpath', $dataDir, '--port', '27017', '--bind_ip', '127.0.0.1', '--logpath', $logFile, '--logappend' `
  -WindowStyle Hidden `
  -PassThru

Start-Sleep -Seconds 3
$process.Refresh()

if ($process.HasExited) {
  throw "MongoDB failed to start. Check $logFile for details."
}

Write-Host "MongoDB started on 127.0.0.1:27017 (PID $($process.Id))."
