package main

import (
	"log"
	"net/http"

	"hypergo/config"
	"hypergo/internal/handlers"
	"hypergo/internal/storage"
)

func main() {
	// Load configuration
	cfg := config.New()
	
	// Initialize storage
	store, err := storage.New(cfg.ShortcutsFile)
	if err != nil {
		log.Fatalf("Failed to initialize storage: %v", err)
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
	
	// Start server
	log.Printf("✨ Server running on port %s", cfg.Port)
	log.Printf("📎 Try going to: http://go/firebase")
	
	if err := http.ListenAndServe(":"+cfg.Port, nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
} 