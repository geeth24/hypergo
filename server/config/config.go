package config

import (
    "os"
    "strconv"

    "github.com/joho/godotenv"
)

// Config holds the application configuration
type Config struct {
	Port          string
	PublicDir     string
	
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

	publicDir := os.Getenv("PUBLIC_DIR")
	if publicDir == "" {
		publicDir = "./public"
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

	return Config{
		Port:          port,
		PublicDir:     publicDir,
		DatabaseURL:    databaseURL,
		RedisURL:       redisURL,
		RedisPassword:  redisPassword,
		RedisDB:        redisDB,
	}
} 