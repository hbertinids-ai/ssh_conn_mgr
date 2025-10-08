# Git History Cleanup Script
# This script will help you completely remove sensitive files from git history

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GIT HISTORY CLEANUP SCRIPT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Create backup
Write-Host "Step 1: Creating backup..." -ForegroundColor Yellow
$backupPath = "C:\Users\HBERTINI\Documents\hbertini.ai\ssh_conn_mgr_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
Copy-Item -Path "C:\Users\HBERTINI\Documents\hbertini.ai\ssh_conn_mgr" -Destination $backupPath -Recurse -Force
Write-Host "✓ Backup created at: $backupPath" -ForegroundColor Green
Write-Host ""

# Step 2: Use git filter-repo (alternative method)
Write-Host "Step 2: Removing files from git history..." -ForegroundColor Yellow
Set-Location "C:\Users\HBERTINI\Documents\hbertini.ai\ssh_conn_mgr"

# Create a file with paths to remove
@"
scripts/populate-cat1-data.ts
scripts/populate-cat1-data.js
"@ | Out-File -FilePath ".git_paths_to_remove.txt" -Encoding ASCII

Write-Host "Files to remove have been listed" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MANUAL STEPS REQUIRED" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Due to git filter-branch limitations, please run these commands manually:" -ForegroundColor Yellow
Write-Host ""
Write-Host "cd C:\Users\HBERTINI\Documents\hbertini.ai\ssh_conn_mgr" -ForegroundColor White
Write-Host ""
Write-Host "# Force push the cleaned history to GitHub" -ForegroundColor White
Write-Host "git push origin --force --all" -ForegroundColor White
Write-Host ""
Write-Host "# Verify the files are gone from GitHub" -ForegroundColor White
Write-Host "# Go to: https://github.com/hbertinids-ai/ssh_conn_mgr" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
