# Connection Troubleshooting Guide

## 1. TestSprite Tunnel Failure
**Issue:** The secure tunnel used by TestSprite to connect your local environment to the cloud testing service may fail or disconnect.

**Root Causes:**
- Unstable internet connection.
- Firewall blocking outbound WebSocket connections.
- Rate limiting by the cloud provider.

**Workarounds:**
1. **Restart the Agent:** Sometimes a simple restart re-initializes the tunnel.
2. **Check Firewall:** Ensure `node.exe` is allowed to make outbound connections.
3. **Manual Tunnel:** If the built-in tunnel fails, you can use `ngrok` manually:
   ```bash
   ngrok http 3000
   ```
   Then provide the ngrok URL to the TestSprite configuration if possible.

## 2. Playwright Browser Automation Failure
**Issue:** Playwright fails to launch browsers on Windows with errors related to environment variables.

**Root Cause:**
- The `$HOME` environment variable is not standard on Windows (which uses `%USERPROFILE%`), but some Linux-centric node tools expect it.

**Fix:**
Add `$HOME` to your system environment variables or set it in your session.
**PowerShell:**
```powershell
$env:HOME = $env:USERPROFILE
```
**CMD:**
```cmd
set HOME=%USERPROFILE%
```

## 3. Lint Command Hanging
**Issue:** `npm run lint` or `eslint` hangs indefinitely in the terminal.

**Root Cause:**
- Interactive prompts or complex file watching mechanisms interacting poorly with certain terminal emulators.

**Fix:**
- run with `--no-cache` to force a fresh run.
- Ensure no other process is locking the files.
