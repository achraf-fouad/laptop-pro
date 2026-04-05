# Deploy frontend dist to cPanel via SSH using plink (PuTTY)
# SSH Details: host=68.65.121.242, port=21098, user=maronqrc

$sshHost = "68.65.121.242"
$sshPort = "21098"
$sshUser = "maronqrc"
$sshPass = "1r26Uf4eAhJB."
$localDist = "C:\Users\achra\Desktop\buis_test\laptop-pro\dist"
$remotePath = "/home/maronqrc/public_html"

Write-Host "Starting deployment to cPanel via SCP..." -ForegroundColor Cyan

# Use SCP to copy files - try using built-in ssh/scp
# First test SSH connection
$env:SSH_ASKPASS = ""
Write-Host "Copying dist folder to $remotePath ..." -ForegroundColor Yellow

# Use scp to upload all dist files
$scpArgs = @(
    "-P", $sshPort,
    "-r",
    "-o", "StrictHostKeyChecking=no",
    "-o", "UserKnownHostsFile=/dev/null",
    "$localDist/*",
    "${sshUser}@${sshHost}:${remotePath}/"
)

Write-Host "Running: scp $scpArgs"

# Use plink for the password automation if available
$plinkPath = Get-Command plink -ErrorAction SilentlyContinue
$scpPath = Get-Command scp -ErrorAction SilentlyContinue
$pscp = Get-Command pscp -ErrorAction SilentlyContinue

if ($plinkPath) {
    Write-Host "Using plink (PuTTY)..." -ForegroundColor Green
    
    # Test connection
    echo "y" | plink -ssh -P $sshPort -pw $sshPass "$sshUser@$sshHost" "echo 'SSH OK'"
    
    # Copy files using pscp
    if ($pscp) {
        pscp -P $sshPort -pw $sshPass -r "$localDist\*" "${sshUser}@${sshHost}:${remotePath}/"
        Write-Host "Files copied successfully!" -ForegroundColor Green
    }
} elseif ($scpPath) {
    Write-Host "SCP found at: $($scpPath.Source)" -ForegroundColor Green
    Write-Host "NOTE: You will be prompted for password: $sshPass" -ForegroundColor Yellow
    scp -P $sshPort -r -o StrictHostKeyChecking=no "$localDist\*" "${sshUser}@${sshHost}:${remotePath}/"
} else {
    Write-Host "No SSH client found. Please install OpenSSH or PuTTY." -ForegroundColor Red
    Write-Host "Checking for OpenSSH..." -ForegroundColor Yellow
    Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'
}
