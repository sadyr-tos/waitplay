$path = "app.js"
$code = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# Replace the start of init() method to load branch context on startup if logged in
$oldInitCode = @'
  init() {
    try {
      this.initDatabaseClients();
      this.loadState();
      this.sortGames();
'@

$newInitCode = @'
  init() {
    try {
      this.initDatabaseClients();
      this.loadState();
      
      // Auto-load active branch context on reload (F5) to persist settings & game states
      if (this.state.email && this.state.activeBranchId) {
        this.loadBranchContext(this.state.email, this.state.activeBranchId);
      }
      
      this.sortGames();
'@

$code = $code.Replace($oldInitCode, $newInitCode)

[System.IO.File]::WriteAllText($path, $code, [System.Text.Encoding]::UTF8)
Write-Host "Injected init branch context loading successfully!"
