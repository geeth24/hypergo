package main

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"hypergo/config"
	"hypergo/internal/handlers"
	"hypergo/internal/storage"
)

func main() {
	// Load configuration
	cfg := config.New()
	
	// Initialize combined storage (PostgreSQL + Redis)
	log.Printf("Connecting to database: %s", cfg.DatabaseURL)
	store, err := storage.NewCombined(
		cfg.DatabaseURL,
		cfg.RedisURL,
		cfg.RedisPassword,
		cfg.RedisDB,
	)
	if err != nil {
		log.Fatalf("Failed to initialize storage: %v", err)
	}
	defer store.Close()
	
	// Import data from JSON file if enabled (migration only)
	if cfg.ImportFromJSON {
		log.Printf("Importing shortcuts from %s", cfg.ShortcutsFile)
		if err := store.ImportFromJSON(cfg.ShortcutsFile); err != nil {
			log.Printf("Failed to import shortcuts: %v", err)
		} else {
			log.Printf("Successfully imported shortcuts from JSON")
			log.Printf("You can now set IMPORT_FROM_JSON=false to disable future imports")
		}
	}
	
	// Create handlers
	redirectHandler := handlers.NewRedirectHandler(store)
	apiHandler := handlers.NewAPIHandler(store)
	
	// Set up routes
	http.HandleFunc("/", redirectHandler.Handler)
	http.HandleFunc("/api/", apiHandler.Handler)
	
	// Serve static files
	fs := http.FileServer(http.Dir(cfg.PublicDir))
	http.Handle("/static/", http.StripPrefix("/static/", fs))
	
	// Set up graceful shutdown
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	
	go func() {
		// Start server
		log.Printf("✨ Server running on port %s", cfg.Port)
		log.Printf("📎 Try going to: http://localhost:%s", cfg.Port)
		
		if err := http.ListenAndServe(":"+cfg.Port, nil); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()
	
	// Wait for interrupt signal
	<-stop
	
	log.Println("Shutting down server...")
} 