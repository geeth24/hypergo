package handlers

import (
	"net/http"

	"hypergo/internal/storage"
)

// RedirectHandler handles redirects for short URLs
type RedirectHandler struct {
	storage *storage.Storage
}

// NewRedirectHandler creates a new redirect handler
func NewRedirectHandler(storage *storage.Storage) *RedirectHandler {
	return &RedirectHandler{
		storage: storage,
	}
}

// Handler handles redirect requests
func (r *RedirectHandler) Handler(w http.ResponseWriter, req *http.Request) {
	if req.URL.Path == "/" {
		http.ServeFile(w, req, "./public/index.html")
		return
	}
	
	shortcode := req.URL.Path[1:] // Remove leading slash
	if shortcode == "api" || shortcode == "" {
		http.NotFound(w, req)
		return
	}
	
	shortcut, exists := r.storage.Get(shortcode)
	if !exists {
		http.NotFound(w, req)
		return
	}
	
	// Update click count asynchronously
	go r.storage.IncrementClicks(shortcode)
	
	http.Redirect(w, req, shortcut.URL, http.StatusMovedPermanently)
} 