$path = "app.js"
$code = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# 1. Update syncActiveBranchToDatabase() to allow syncing if activeBranchId is present
$oldSyncStart = "      if (!this.state.email || this.state.subscription === 'none') return;"
$newSyncStart = "      if (!this.state.email || !this.state.activeBranchId) return;"
$code = $code.Replace($oldSyncStart, $newSyncStart)

# 2. Update saveState() to save logged profile if activeBranchId is present
$oldSaveStateStart = "      if (this.state.email && this.state.subscription !== 'none') {"
$newSaveStateStart = "      if (this.state.email && this.state.activeBranchId) {"
$code = $code.Replace($oldSaveStateStart, $newSaveStateStart)

[System.IO.File]::WriteAllText($path, $code, [System.Text.Encoding]::UTF8)
Write-Host "Updated subscription sync constraints successfully!"
