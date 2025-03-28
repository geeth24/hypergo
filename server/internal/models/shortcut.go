package models

// Shortcut represents a URL shortcode
type Shortcut struct {
	URL       string `json:"url"`
	CreatedAt string `json:"createdAt"`
	Clicks    int    `json:"clicks"`
}

// Shortcuts is a map of shortcodes to shortcuts
type Shortcuts map[string]Shortcut 