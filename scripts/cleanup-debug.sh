#!/bin/bash

# AI Prompt Library - Debug Cleanup Script
# This script removes debug components and temporary files

echo "🧹 Cleaning up debug components and temporary files..."

# Remove debug components
echo "Removing debug components..."
rm -f components/database-debug.tsx
rm -f components/dropdown-test.tsx  
rm -f components/html-native-test.tsx
rm -f components/radix-native-test.tsx

# Remove debug API routes
echo "Removing debug API routes..."
rm -rf app/api/prompts/test-connection/

# Remove temporary optimization files (keep originals as backup)
echo "Cleaning up optimization files..."
rm -f components/prompt-card-optimized.tsx
rm -f components/prompt-gallery-optimized.tsx
rm -f app/page-optimized.tsx
rm -f app/api/prompts/[id]/route-optimized.ts

# Remove step-by-step SQL files (keep main ones)
echo "Cleaning up temporary SQL files..."
rm -f scripts/007_step_by_step.sql
rm -f scripts/007_add_delete_policy.sql
rm -f scripts/007_add_orphan_policy.sql
rm -f scripts/007_verify_policies.sql

# Clean up build artifacts
echo "Cleaning build artifacts..."
rm -rf .next/
rm -rf out/
rm -rf dist/

# Clean up logs
echo "Cleaning logs..."
rm -f *.log
rm -f npm-debug.log*
rm -f yarn-debug.log*
rm -f yarn-error.log*

echo "✅ Cleanup completed!"
echo ""
echo "📋 Summary of cleaned files:"
echo "  • Debug components removed"
echo "  • Temporary API routes removed"  
echo "  • Build artifacts cleaned"
echo "  • Log files removed"
echo ""
echo "🔄 Next steps:"
echo "  1. Run 'pnpm install' to ensure dependencies are clean"
echo "  2. Run 'pnpm build' to test the production build"
echo "  3. Run 'pnpm dev' to start development server"
