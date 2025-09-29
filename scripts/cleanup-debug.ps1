# AI Prompt Library - Debug Cleanup Script (PowerShell)
# This script removes debug components and temporary files

Write-Host "🧹 Cleaning up debug components and temporary files..." -ForegroundColor Cyan

# Remove debug components
Write-Host "Removing debug components..." -ForegroundColor Yellow
$debugComponents = @(
    "components\database-debug.tsx",
    "components\dropdown-test.tsx",
    "components\html-native-test.tsx", 
    "components\radix-native-test.tsx"
)

foreach ($file in $debugComponents) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✓ Removed $file" -ForegroundColor Green
    }
}

# Remove debug API routes
Write-Host "Removing debug API routes..." -ForegroundColor Yellow
if (Test-Path "app\api\prompts\test-connection") {
    Remove-Item "app\api\prompts\test-connection" -Recurse -Force
    Write-Host "  ✓ Removed test-connection API route" -ForegroundColor Green
}

# Remove temporary optimization files
Write-Host "Cleaning up optimization files..." -ForegroundColor Yellow
$tempFiles = @(
    "components\prompt-card-optimized.tsx",
    "components\prompt-gallery-optimized.tsx",
    "app\page-optimized.tsx",
    "app\api\prompts\[id]\route-optimized.ts"
)

foreach ($file in $tempFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✓ Removed $file" -ForegroundColor Green
    }
}

# Remove step-by-step SQL files
Write-Host "Cleaning up temporary SQL files..." -ForegroundColor Yellow
$sqlFiles = @(
    "scripts\007_step_by_step.sql",
    "scripts\007_add_delete_policy.sql", 
    "scripts\007_add_orphan_policy.sql",
    "scripts\007_verify_policies.sql"
)

foreach ($file in $sqlFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✓ Removed $file" -ForegroundColor Green
    }
}

# Clean up build artifacts
Write-Host "Cleaning build artifacts..." -ForegroundColor Yellow
$buildDirs = @(".next", "out", "dist")
foreach ($dir in $buildDirs) {
    if (Test-Path $dir) {
        Remove-Item $dir -Recurse -Force
        Write-Host "  ✓ Removed $dir directory" -ForegroundColor Green
    }
}

# Clean up logs
Write-Host "Cleaning logs..." -ForegroundColor Yellow
$logFiles = Get-ChildItem -Path "." -Filter "*.log" -File
foreach ($file in $logFiles) {
    Remove-Item $file.FullName -Force
    Write-Host "  ✓ Removed $($file.Name)" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Cleanup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary of cleaned files:" -ForegroundColor Cyan
Write-Host "  • Debug components removed" -ForegroundColor White
Write-Host "  • Temporary API routes removed" -ForegroundColor White
Write-Host "  • Build artifacts cleaned" -ForegroundColor White  
Write-Host "  • Log files removed" -ForegroundColor White
Write-Host ""
Write-Host "🔄 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run 'pnpm install' to ensure dependencies are clean" -ForegroundColor White
Write-Host "  2. Run 'pnpm build' to test the production build" -ForegroundColor White
Write-Host "  3. Run 'pnpm dev' to start development server" -ForegroundColor White
