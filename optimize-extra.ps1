$ErrorActionPreference = "Stop"

$workspace = "c:\Users\aadit\Desktop\Riot_web"
$videosDir = Join-Path $workspace "frontend\public\videos"
$imgDir = Join-Path $workspace "frontend\public\img"
$distDir = Join-Path $workspace "frontend\dist"

Write-Host "=== Generating Video Posters and WebP Images ===" -ForegroundColor Cyan

# 1. Generate Posters for Videos
$videos = Get-ChildItem -Path $videosDir -Filter "*.mp4"
foreach ($video in $videos) {
    $posterName = "$($video.BaseName)-poster.webp"
    $posterPath = Join-Path $videosDir $posterName
    Write-Host "Creating poster for $($video.Name) -> $posterName" -ForegroundColor Yellow
    # Extract frame at 1 sec or 0.5 sec, scaled to max 1920, compressed to high quality WebP
    & ffmpeg -y -v error -ss 00:00:01 -i $video.FullName -vf "scale='min(1920,iw)':-2" -vframes 1 -c:v libwebp -quality 80 $posterPath
    if (Test-Path $posterPath) {
        $sizeKB = [math]::Round((Get-Item $posterPath).Length / 1KB, 1)
        Write-Host "  -> Created $posterName ($sizeKB KB)" -ForegroundColor Green
    }
}

# 2. Generate WebP versions for Images
$images = Get-ChildItem -Path $imgDir -File | Where-Object { $_.Extension -in @(".png", ".jpg", ".jpeg") }
foreach ($img in $images) {
    $webpName = "$($img.BaseName).webp"
    $webpPath = Join-Path $imgDir $webpName
    Write-Host "Converting image $($img.Name) -> $webpName" -ForegroundColor Yellow
    & ffmpeg -y -v error -i $img.FullName -vf "scale='min(1920,iw)':-2" -c:v libwebp -quality 82 $webpPath
    if (Test-Path $webpPath) {
        $sizeKB = [math]::Round((Get-Item $webpPath).Length / 1KB, 1)
        Write-Host "  -> Created $webpName ($sizeKB KB)" -ForegroundColor Green
    }
}

# 3. Sync to dist if exists
if (Test-Path $distDir) {
    Write-Host "Syncing to dist..." -ForegroundColor Cyan
    Copy-Item -Recurse -Force "$videosDir\*" (Join-Path $distDir "videos") -ErrorAction SilentlyContinue
    Copy-Item -Recurse -Force "$imgDir\*" (Join-Path $distDir "img") -ErrorAction SilentlyContinue
}

Write-Host "=== Done generating extra optimized media! ===" -ForegroundColor Green
