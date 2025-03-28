package config

import (
	"os"
	"path/filepath"
)

// Config holds the application configuration
type Config struct {
	Port          string
	ShortcutsFile string
	PublicDir     string
}

// New creates a new config
func New() Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8079"
	}

	shortcutsFile := os.Getenv("SHORTCUTS_FILE")
	if shortcutsFile == "" {
		shortcutsFile = "shortcuts.json"
	}

	publicDir := os.Getenv("PUBLIC_DIR")
	if publicDir == "" {
		publicDir = "./public"
	}

	// Make sure the public directory exists
	os.MkdirAll(publicDir, 0755)

	// Make sure the directory for the shortcuts file exists
	dir := filepath.Dir(shortcutsFile)
	if dir != "." {
		os.MkdirAll(dir, 0755)
	}

	return Config{
		Port:          port,
		ShortcutsFile: shortcutsFile,
		PublicDir:     publicDir,
	}
} 