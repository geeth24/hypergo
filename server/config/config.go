package config

import (
	"os"
	"path/filepath"
	"strconv"

	"github.com/joho/godotenv"
)

// Config holds the application configuration
type Config struct {
	Port          string
	ShortcutsFile string
	PublicDir     string
	ImportFromJSON bool
	
	// Database settings
	DatabaseURL string
	
	// Redis settings
	RedisURL      string
	RedisPassword string
	RedisDB       int
}

// New creates a new config
func New() Config {
	// Load .env file if it exists
	godotenv.Load()
	
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
	
	importFromJSON := true
	if val := os.Getenv("IMPORT_FROM_JSON"); val != "" {
		importFromJSON = val == "true"
	}

	// Database settings
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		databaseURL = "postgres://postgres:postgres@localhost:5432/hypergo"
	}
	
	// Redis settings
	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "localhost:6379"
	}
	
	redisPassword := os.Getenv("REDIS_PASSWORD")
	
	redisDB := 0
	if val := os.Getenv("REDIS_DB"); val != "" {
		redisDB, _ = strconv.Atoi(val)
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
		ImportFromJSON: importFromJSON,
		DatabaseURL:    databaseURL,
		RedisURL:       redisURL,
		RedisPassword:  redisPassword,
		RedisDB:        redisDB,
	}
} 