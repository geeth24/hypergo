package storage

import (
	"encoding/json"
	"os"
	"sync"

	"hypergo/internal/models"
)

// Storage handles the persistence of shortcuts
type Storage struct {
	shortcuts models.Shortcuts
	filename  string
	mutex     sync.RWMutex
}

// New creates a new storage instance
func New(filename string) (*Storage, error) {
	s := &Storage{
		shortcuts: models.Shortcuts{},
		filename:  filename,
	}

	if err := s.load(); err != nil {
		return nil, err
	}

	return s, nil
}

// load shortcuts from the JSON file
func (s *Storage) load() error {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	data, err := os.ReadFile(s.filename)
	if err != nil {
		if os.IsNotExist(err) {
			s.shortcuts = models.Shortcuts{}
			return s.save()
		}
		return err
	}
	return json.Unmarshal(data, &s.shortcuts)
}

// save the shortcuts to the JSON file
func (s *Storage) save() error {
	data, err := json.MarshalIndent(s.shortcuts, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(s.filename, data, 0644)
}

// GetAll returns all shortcuts
func (s *Storage) GetAll() models.Shortcuts {
	s.mutex.RLock()
	defer s.mutex.RUnlock()
	
	// Create a copy to avoid concurrent map access
	result := models.Shortcuts{}
	for k, v := range s.shortcuts {
		result[k] = v
	}
	return result
}

// Get returns a shortcut by shortcode
func (s *Storage) Get(shortcode string) (models.Shortcut, bool) {
	s.mutex.RLock()
	defer s.mutex.RUnlock()
	
	shortcut, exists := s.shortcuts[shortcode]
	return shortcut, exists
}

// Create adds a new shortcut
func (s *Storage) Create(shortcode string, shortcut models.Shortcut) error {
	s.mutex.Lock()
	defer s.mutex.Unlock()
	
	s.shortcuts[shortcode] = shortcut
	return s.save()
}

// Update updates an existing shortcut
func (s *Storage) Update(shortcode string, shortcut models.Shortcut) error {
	s.mutex.Lock()
	defer s.mutex.Unlock()
	
	s.shortcuts[shortcode] = shortcut
	return s.save()
}

// IncrementClicks increases the click count for a shortcut
func (s *Storage) IncrementClicks(shortcode string) error {
	s.mutex.Lock()
	defer s.mutex.Unlock()
	
	shortcut, exists := s.shortcuts[shortcode]
	if !exists {
		return nil
	}
	
	shortcut.Clicks++
	s.shortcuts[shortcode] = shortcut
	return s.save()
} 