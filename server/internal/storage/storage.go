package storage

import (
	"hypergo/internal/models"
)

// StorageInterface defines required methods for storage implementations
type StorageInterface interface {
	GetAll() models.Shortcuts
	Get(shortcode string) (models.Shortcut, bool)
	Create(shortcode string, shortcut models.Shortcut) error
	Update(shortcode string, shortcut models.Shortcut) error
	IncrementClicks(shortcode string) error
	Close()
} 