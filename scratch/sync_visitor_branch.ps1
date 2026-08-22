$path = "app.js"
$code = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# Find and replace the start of loadBranchContext to inject visitorConnectedBranchId sync
$oldLoadContext = @'
      this.state.email = client.email;
      this.state.phone = client.phone;
      this.state.activeBranchId = branchId;
      this.state.subscription = br.subscription;
'@

$newLoadContext = @'
      this.state.email = client.email;
      this.state.phone = client.phone;
      this.state.activeBranchId = branchId;
      
      // Auto-sync visitor branch to match the active B2B branch for seamless simulator testing
      this.state.visitorConnectedBranchId = branchId;
      
      this.state.subscription = br.subscription;
'@

$code = $code.Replace($oldLoadContext, $newLoadContext)

# Add B2C lobby re-render triggers at the end of loadBranchContext
$oldLoadEnd = @'
      this.updateAdminView();
      this.renderAdminGamesGrid();
      this.renderCreatorClientsList();
    } catch (e) {
'@

$newLoadEnd = @'
      this.updateAdminView();
      this.renderAdminGamesGrid();
      this.renderCreatorClientsList();
      
      // Re-render guest lobby if simulator is currently open
      if (this.state.visitorActiveView === 'lobby') {
        this.initVisitorLobby();
        this.renderVisitorLobbyGames();
      }
    } catch (e) {
'@

$code = $code.Replace($oldLoadEnd, $newLoadEnd)

[System.IO.File]::WriteAllText($path, $code, [System.Text.Encoding]::UTF8)
Write-Host "Injected visitor branch sync successfully!"
