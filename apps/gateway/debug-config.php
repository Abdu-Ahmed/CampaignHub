<?php

// Place this file in your Laravel project root
// Run it with: docker-compose -f infrastructure/docker-compose.yml exec gateway php debug-config.php

// Get the Laravel application instance
require __DIR__.'/bootstrap/app.php';

// Don't bootstrap the whole app, just load what we need
$app = new Illuminate\Foundation\Application(
    $_ENV['APP_BASE_PATH'] ?? dirname(__DIR__)
);

// Register the config component
$app->singleton(
    Illuminate\Contracts\Config\Repository::class,
    function ($app) {
        return new Illuminate\Config\Repository();
    }
);

// Load all configuration files manually and check each one
$configPath = $app->configPath();
$files = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($configPath)
);

foreach ($files as $file) {
    if ($file->isFile() && $file->getExtension() === 'php') {
        $relativePath = str_replace($configPath . '/', '', $file->getPathname());
        $configKey = pathinfo($relativePath, PATHINFO_FILENAME);
        
        try {
            // Try to require the file directly to see if it returns valid data
            $configValue = require $file->getPathname();
            if (!is_array($configValue)) {
                echo "PROBLEM FOUND: {$file->getPathname()} returns " . gettype($configValue) . " instead of array\n";
            } else {
                echo "OK: {$file->getPathname()} returns array\n";
            }
        } catch (Throwable $e) {
            echo "ERROR: {$file->getPathname()} - {$e->getMessage()}\n";
        }
    }
}

echo "\nChecking for malformed environment variables that might affect config loading:\n";
// Debug environment variables that might affect config
$criticalEnvVars = ['APP_ENV', 'APP_DEBUG', 'APP_URL', 'LOG_CHANNEL'];
foreach ($criticalEnvVars as $var) {
    echo "$var: " . (getenv($var) ?: 'not set') . "\n";
}