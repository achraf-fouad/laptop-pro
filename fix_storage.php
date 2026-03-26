<?php
/**
 * Fix Storage Link for MarocLaptop on cPanel
 * Upload this file to your public_html folder and visit it in browser: maroclaptop.com/fix_storage.php
 */

// 1. Define Paths (Adjust based on your actual cPanel user)
$userName = get_current_user(); // Tries to get the linux user
$publicHtmlPath = "/home/{$userName}/public_html";
$backendStoragePath = "/home/{$userName}/backend/storage/app/public";

// If the above paths are wrong, try manually setting them:
// $publicHtmlPath = __DIR__;
// $backendStoragePath = realpath(__DIR__ . '/../backend/storage/app/public');

echo "<h2>MarocLaptop Storage Fix</h2>";
echo "Public HTML: <b>" . $publicHtmlPath . "</b><br>";
echo "Backend Storage: <b>" . $backendStoragePath . "</b><br><br>";

$targetLink = $publicHtmlPath . '/storage';

if (file_exists($targetLink)) {
    if (is_link($targetLink)) {
        echo "✅ The link already exists at: <b>{$targetLink}</b><br>";
        echo "Target: <b>" . readlink($targetLink) . "</b><br>";
    } else {
        echo "❌ A FOLDER named 'storage' exists. Please delete it via cPanel File Manager and refresh this page.<br>";
    }
} else {
    echo "Attempting to create symlink...<br>";
    if (symlink($backendStoragePath, $targetLink)) {
        echo "🎉 SUCCESS! The storage link has been created.<br>";
    } else {
        echo "❌ FAILED to create symlink. Error: " . error_get_last()['message'] . "<br>";
        echo "Try creating it manually via cPanel File Manager or Terminal: <br>";
        echo "<code>ln -s " . $backendStoragePath . " " . $targetLink . "</code>";
    }
}
