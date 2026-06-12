$dir = Join-Path $PSScriptRoot "..\tools"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$zip = Join-Path $dir "atlas-cli.zip"
$url = "https://fastdl.mongodb.org/mongocli/mongodb-atlas-cli_1.55.0_windows_x86_64.zip"
if (-not (Test-Path (Join-Path $dir "atlas\bin\atlas.exe"))) {
  Write-Host "Downloading Atlas CLI..."
  curl.exe -L -o $zip $url
  Expand-Archive -Path $zip -DestinationPath (Join-Path $dir "atlas") -Force
}
Write-Host "Atlas CLI ready at $dir\atlas\bin\atlas.exe"
