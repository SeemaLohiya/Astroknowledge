# Provisions MongoDB Atlas M0 cluster and configures Render MONGODB_URI.
# Requires one-time browser login in the popup Atlas CLI window.

$ErrorActionPreference = "Stop"
$AtlasBin = Join-Path $PSScriptRoot "..\tools\atlas\bin\atlas.exe"
$RenderKey = if ($env:RENDER_API_KEY) { $env:RENDER_API_KEY } else { "rnd_IQjIitAJYEdd8aBmmOLQQ43tf7FO" }
$RenderServiceId = "srv-d8lpek0g4nts73flkd8g"
$ClusterName = "AstroKnowledge"
$DbUser = "astroknowledge_admin"
$DbPass = "Ak" + ([guid]::NewGuid().ToString("N").Substring(0, 14)) + "!9"
$DbName = "astroknowledge"

function Test-AtlasAuth {
  $prev = $ErrorActionPreference
  $ErrorActionPreference = "SilentlyContinue"
  $out = & $AtlasBin auth whoami 2>&1 | Out-String
  $ErrorActionPreference = $prev
  return ($LASTEXITCODE -eq 0 -and $out -notmatch "not logged in")
}

Write-Host "=== AstroKnowledge MongoDB Atlas Provisioner ===" -ForegroundColor Cyan

if (-not (Test-Path $AtlasBin)) {
  throw "Atlas CLI not found at $AtlasBin"
}

if (-not (Test-AtlasAuth)) {
  Write-Host "Opening Atlas login window. Sign in with astroknowledge01@gmail.com" -ForegroundColor Yellow
  Start-Process -FilePath $AtlasBin -ArgumentList @("auth", "login") -WorkingDirectory (Split-Path $AtlasBin)

  $deadline = (Get-Date).AddMinutes(8)
  while ((Get-Date) -lt $deadline) {
    Start-Sleep -Seconds 8
    if (Test-AtlasAuth) {
      Write-Host "Atlas login successful." -ForegroundColor Green
      break
    }
    Write-Host "Waiting for Atlas login..."
  }
  if (-not (Test-AtlasAuth)) {
    throw "Atlas login timed out. Re-run after logging in."
  }
}

Write-Host "Creating M0 cluster $ClusterName in AWS Mumbai..." -ForegroundColor Cyan
& $AtlasBin setup --force `
  --clusterName $ClusterName `
  --provider AWS `
  --region AP_SOUTH_1 `
  --username $DbUser `
  --password $DbPass `
  --accessListIp "0.0.0.0/0" `
  --connectWith skip `
  --skipSampleData

$projectsRaw = & $AtlasBin projects list -o json 2>&1 | Out-String
$projectId = $null
try {
  $parsed = $projectsRaw | ConvertFrom-Json
  if ($parsed.results -and $parsed.results.Count -gt 0) {
    $projectId = $parsed.results[0].id
  }
} catch {}

if (-not $projectId) {
  throw "Could not resolve Atlas project id."
}

$clustersRaw = & $AtlasBin clusters list --projectId $projectId -o json 2>&1 | Out-String
$cluster = $null
try {
  $cp = $clustersRaw | ConvertFrom-Json
  $cluster = $cp.results | Where-Object { $_.name -eq $ClusterName } | Select-Object -First 1
  if (-not $cluster -and $cp.results.Count -gt 0) { $cluster = $cp.results[0] }
} catch {}

if (-not $cluster) {
  throw "No Atlas cluster found after setup."
}

$clusterName = $cluster.name
Write-Host "Cluster: $clusterName state=$($cluster.stateName)" -ForegroundColor Green

$connRaw = & $AtlasBin clusters connectionStrings describe $clusterName --projectId $projectId -o json 2>&1 | Out-String
$standardSrv = $null
try {
  $conn = $connRaw | ConvertFrom-Json
  $standardSrv = $conn.connectionStrings.standardSrv
} catch {}

if (-not $standardSrv) {
  throw "Could not fetch cluster connection string."
}

$encodedUser = [uri]::EscapeDataString($DbUser)
$encodedPass = [uri]::EscapeDataString($DbPass)
$mongoUri = $standardSrv -replace "mongodb\+srv://", "mongodb+srv://${encodedUser}:${encodedPass}@"
if ($mongoUri -notmatch "/$DbName") {
  $mongoUri = $mongoUri -replace "\?", "/$DbName?"
}

Write-Host "Setting MONGODB_URI on Render..." -ForegroundColor Cyan
$body = (@{ value = $mongoUri } | ConvertTo-Json -Compress)
curl.exe -s -X PUT "https://api.render.com/v1/services/$RenderServiceId/env-vars/MONGODB_URI" `
  -H "Authorization: Bearer $RenderKey" `
  -H "Content-Type: application/json" `
  -d $body | Out-Null

Write-Host "Triggering Render redeploy..." -ForegroundColor Cyan
curl.exe -s -X POST "https://api.render.com/v1/services/$RenderServiceId/deploys" `
  -H "Authorization: Bearer $RenderKey" `
  -H "Content-Type: application/json" `
  -d "{}" | Out-Null

$credFile = Join-Path $PSScriptRoot "..\data\atlas-credentials.local.json"
@{
  cluster = $clusterName
  projectId = $projectId
  dbUser = $DbUser
  dbName = $DbName
  provisionedAt = (Get-Date).ToString("o")
} | ConvertTo-Json | Set-Content $credFile -Encoding UTF8

Write-Host "DONE. MongoDB provisioned and Render updated." -ForegroundColor Green
Write-Host "DB user: $DbUser"
Write-Host "DB name: $DbName"
Write-Host "Health check: https://astroknowledge.onrender.com/api/health/db"
