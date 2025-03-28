package handlers

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"
	"net/url"

	"hypergo/internal/models"
	"hypergo/internal/storage"
)

// APIHandler handles API requests
type APIHandler struct {
	storage storage.StorageInterface
}

// NewAPIHandler creates a new API handler
func NewAPIHandler(storage storage.StorageInterface) *APIHandler {
	return &APIHandler{
		storage: storage,
	}
}

// Handler handles API requests
func (a *APIHandler) Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	
	// Handle preflight requests
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	
	path := strings.TrimPrefix(r.URL.Path, "/api/")
	
	switch {
	case path == "health":
		a.healthHandler(w, r)
	case path == "shortcuts" && r.Method == http.MethodGet:
		a.getShortcutsHandler(w, r)
	case path == "shortcuts" && r.Method == http.MethodPost:
		a.createShortcutHandler(w, r)
	case strings.HasPrefix(path, "shortcuts/") && r.Method == http.MethodGet:
		// Handle get single shortcut
		shortcode, err := url.PathUnescape(strings.TrimPrefix(path, "shortcuts/"))
		if err != nil {
			http.Error(w, "Invalid shortcode", http.StatusBadRequest)
			return
		}
		a.getShortcutHandler(w, r, shortcode)
	case strings.HasPrefix(path, "shortcuts/") && r.Method == http.MethodPUT:
		// Handle update shortcut
		shortcode, err := url.PathUnescape(strings.TrimPrefix(path, "shortcuts/"))
		if err != nil {
			http.Error(w, "Invalid shortcode", http.StatusBadRequest)
			return
		}
		a.updateShortcutHandler(w, r, shortcode)
	default:
		http.NotFound(w, r)
	}
}

func (a *APIHandler) healthHandler(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(map[string]string{"status": "healthy"})
}

func (a *APIHandler) getShortcutsHandler(w http.ResponseWriter, r *http.Request) {
	shortcuts := a.storage.GetAll()
	json.NewEncoder(w).Encode(shortcuts)
}

func (a *APIHandler) getShortcutHandler(w http.ResponseWriter, r *http.Request, shortcode string) {
	shortcut, exists := a.storage.Get(shortcode)
	if !exists {
		http.NotFound(w, r)
		return
	}
	
	json.NewEncoder(w).Encode(shortcut)
}

func (a *APIHandler) updateShortcutHandler(w http.ResponseWriter, r *http.Request, shortcode string) {
	var body struct {
		URL string `json:"url"`
	}
	
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	
	if body.URL == "" {
		http.Error(w, "Missing url", http.StatusBadRequest)
		return
	}
	
	// Get the existing shortcut
	existing, exists := a.storage.Get(shortcode)
	if !exists {
		http.NotFound(w, r)
		return
	}
	
	// Update only the URL, keep other properties
	existing.URL = body.URL
	
	if err := a.storage.Update(shortcode, existing); err != nil {
		http.Error(w, "Failed to update shortcut", http.StatusInternalServerError)
		return
	}
	
	// Return the updated shortcut
	json.NewEncoder(w).Encode(existing)
}

func (a *APIHandler) createShortcutHandler(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Shortcode string `json:"shortcode"`
		URL       string `json:"url"`
	}
	
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	
	if body.Shortcode == "" || body.URL == "" {
		http.Error(w, "Missing shortcode or url", http.StatusBadRequest)
		return
	}
	
	shortcut := models.Shortcut{
		URL:       body.URL,
		CreatedAt: time.Now().Format(time.RFC3339),
		Clicks:    0,
	}
	
	if err := a.storage.Create(body.Shortcode, shortcut); err != nil {
		http.Error(w, "Failed to save shortcut", http.StatusInternalServerError)
		return
	}
	
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":  "Shortcut created",
		"shortcut": shortcut,
	})
} 