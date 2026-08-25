$ErrorActionPreference = "Stop"

$workspace = "c:\Users\aadit\Desktop\Riot_web"
$videosDir = Join-Path $workspace "front\public\videos"
$imgDir = Join-Path $workspace "front\public\img"
$backupDir = Join-Path $workspace "front\public_media_backup"

Write-Host "=== Starting Media Optimization Pipeline ===" -ForegroundColor Cyan

# Create backup directory
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}
$backupVideos = Join-Path $backupDir "videos"
$backupImg = Join-Path $backupDir "img"
if (-not (Test-Path $backupVideos)) { New-Item -ItemType Directory -Path $backupVideos | Out-Null }
if (-not (Test-Path $backupImg)) { New-Item -ItemType Directory -Path $backupImg | Out-Null }

$results = @()

# Process Videos
$videoFiles = Get-ChildItem -Path $videosDir -Filter "*.mp4"
foreach ($file in $videoFiles) {
    $origSize = $file.Length
    $backupPath = Join-Path $backupVideos $file.Name
    if (-not (Test-Path $backupPath)) {
        Copy-Item $file.FullName $backupPath
    }
    
    $tempOutput = Join-Path $videosDir "$($file.BaseName).opt.mp4"
    Write-Host "Optimizing video: $($file.Name) (Orig: $([math]::Round($origSize/1MB, 2)) MB)..." -ForegroundColor Yellow
    
    # Scale down if >1920, CRF 25, slow preset, yuv420p, +faststart, strip unneeded audio (-an)
    & ffmpeg -y -v error -i $file.FullName -vf "scale='min(1920,iw)':-2" -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p -movflags +faststart -an $tempOutput
    
    if (Test-Path $tempOutput) {
        $optSize = (Get-Item $tempOutput).Length
        Remove-Item $file.FullName -Force
        Move-Item $tempOutput $file.FullName -Force
        
        $savingPct = [math]::Round((($origSize - $optSize) / $origSize) * 100, 1)
        $results += [PSCustomObject]@{
            Type = "Video"
            File = $file.Name
            OrigMB = [math]::Round($origSize / 1MB, 2)
            NewMB = [math]::Round($optSize / 1MB, 2)
            Savings = "$savingPct %"
        }
        Write-Host "  -> Done: $([math]::Round($optSize/1MB, 2)) MB ($savingPct% saved)" -ForegroundColor Green
    }
}

# Process Images
$imgFiles = Get-ChildItem -Path $imgDir -File | Where-Object { $_.Name -notlike "*.opt.*" }
foreach ($file in $imgFiles) {
    $origSize = $file.Length
    $backupPath = Join-Path $backupImg $file.Name
    if (-not (Test-Path $backupPath)) {
        Copy-Item $file.FullName $backupPath
    }
    
    # Skip tiny icons like logo.png
    if ($origSize -lt 20000) {
        $results += [PSCustomObject]@{
            Type = "Image"
            File = $file.Name
            OrigMB = [math]::Round($origSize / 1MB, 3)
            NewMB = [math]::Round($origSize / 1MB, 3)
            Savings = "0 % (Kept)"
        }
        continue
    }

    $ext = $file.Extension.ToLower()
    $tempOutput = Join-Path $imgDir "$($file.BaseName).opt$ext"
    Write-Host "Optimizing image: $($file.Name) (Orig: $([math]::Round($origSize/1MB, 2)) MB)..." -ForegroundColor Yellow
    
    if ($ext -eq ".png") {
        & ffmpeg -y -v error -i $file.FullName -vf "scale='min(1920,iw)':-2" $tempOutput
    } elseif ($ext -eq ".jpg" -or $ext -eq ".jpeg") {
        & ffmpeg -y -v error -i $file.FullName -vf "scale='min(1920,iw)':-2" -q:v 3 $tempOutput
    }
    
    if (Test-Path $tempOutput) {
        $optSize = (Get-Item $tempOutput).Length
        # If optimized is smaller, replace
        if ($optSize -lt $origSize) {
            Remove-Item $file.FullName -Force
            Move-Item $tempOutput $file.FullName -Force
            $finalSize = $optSize
        } else {
            Remove-Item $tempOutput -Force
            $finalSize = $origSize
        }
        
        $savingPct = [math]::Round((($origSize - $finalSize) / $origSize) * 100, 1)
        $results += [PSCustomObject]@{
            Type = "Image"
            File = $file.Name
            OrigMB = [math]::Round($origSize / 1MB, 2)
            NewMB = [math]::Round($finalSize / 1MB, 2)
            Savings = "$savingPct %"
        }
        Write-Host "  -> Done: $([math]::Round($finalSize/1MB, 2)) MB ($savingPct% saved)" -ForegroundColor Green
    }
}

# Also update dist if it exists
$distDir = Join-Path $workspace "front\dist"
if (Test-Path $distDir) {
    Write-Host "Syncing optimized assets to front/dist..." -ForegroundColor Cyan
    Copy-Item -Recurse -Force "$videosDir\*" (Join-Path $distDir "videos") -ErrorAction SilentlyContinue
    Copy-Item -Recurse -Force "$imgDir\*" (Join-Path $distDir "img") -ErrorAction SilentlyContinue
}

Write-Host "`n=== OPTIMIZATION SUMMARY ===" -ForegroundColor Cyan
$results | Format-Table -AutoSize

$totalOrig = ($results | Measure-Object -Property OrigMB -Sum).Sum
$totalNew = ($results | Measure-Object -Property NewMB -Sum).Sum
$totalSaved = [math]::Round((($totalOrig - $totalNew) / $totalOrig) * 100, 1)

Write-Host "Total Original Size: $([math]::Round($totalOrig, 2)) MB" -ForegroundColor Magenta
Write-Host "Total Optimized Size: $([math]::Round($totalNew, 2)) MB" -ForegroundColor Green
Write-Host "Overall Bandwidth Reduction: $totalSaved %" -ForegroundColor Green
