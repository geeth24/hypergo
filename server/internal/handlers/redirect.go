package handlers

import (
	"net/http"
	"strings"

	"hypergo/internal/storage"
)

// RedirectHandler handles redirects for short URLs
type RedirectHandler struct {
	storage storage.StorageInterface
}

// NewRedirectHandler creates a new redirect handler
func NewRedirectHandler(storage storage.StorageInterface) *RedirectHandler {
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
	
	// Normalize path to extract shortcode
	path := strings.TrimPrefix(req.URL.Path, "/") // remove leading slash

	// Ignore API and static routes
	if path == "" || path == "api" || strings.HasPrefix(path, "api/") || strings.HasPrefix(path, "static/") {
		http.NotFound(w, req)
		return
	}

	// Support optional "/go/" prefix so both "/shortcode" and "/go/shortcode" work
	if strings.HasPrefix(path, "go/") {
		path = strings.TrimPrefix(path, "go/")
	}

	shortcode := strings.Trim(path, "/")
	if shortcode == "" {
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