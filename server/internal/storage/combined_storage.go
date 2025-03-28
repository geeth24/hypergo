package storage

import (
	"hypergo/internal/models"
)

// CombinedStorage combines PostgreSQL for persistence and Redis for caching
type CombinedStorage struct {
	db    *PostgresStorage
	cache *RedisCache
}

// NewCombined creates a new combined storage instance
func NewCombined(databaseURL, redisURL, redisPassword string, redisDB int) (*CombinedStorage, error) {
	// Initialize PostgreSQL storage
	db, err := NewPostgres(databaseURL)
	if err != nil {
		return nil, err
	}
	
	// Initialize Redis cache (continue even if Redis is not available)
	var cache *RedisCache
	cache, err = NewRedisCache(redisURL, redisPassword, redisDB)
	if err != nil {
		// Log the error but continue without caching
		cache = nil
	}
	
	return &CombinedStorage{
		db:    db,
		cache: cache,
	}, nil
}

// GetAll returns all shortcuts from database
func (s *CombinedStorage) GetAll() models.Shortcuts {
	return s.db.GetAll()
}

// Get returns a shortcut by shortcode, checking cache first
func (s *CombinedStorage) Get(shortcode string) (models.Shortcut, bool) {
	// Try cache first if available
	if s.cache != nil {
		if shortcut, found := s.cache.GetShortcut(shortcode); found {
			return shortcut, true
		}
	}
	
	// Fall back to database
	shortcut, found := s.db.Get(shortcode)
	
	// Update cache if found and cache is available
	if found && s.cache != nil {
		s.cache.SetShortcut(shortcode, shortcut)
	}
	
	return shortcut, found
}

// Create adds a new shortcut
func (s *CombinedStorage) Create(shortcode string, shortcut models.Shortcut) error {
	// Store in database
	if err := s.db.Create(shortcode, shortcut); err != nil {
		return err
	}
	
	// Update cache if available
	if s.cache != nil {
		return s.cache.SetShortcut(shortcode, shortcut)
	}
	
	return nil
}

// Update updates an existing shortcut
func (s *CombinedStorage) Update(shortcode string, shortcut models.Shortcut) error {
	// Update in database
	if err := s.db.Update(shortcode, shortcut); err != nil {
		return err
	}
	
	// Update cache if available
	if s.cache != nil {
		return s.cache.SetShortcut(shortcode, shortcut)
	}
	
	return nil
}

// IncrementClicks increases the click count for a shortcut
func (s *CombinedStorage) IncrementClicks(shortcode string) error {
	// Update in database
	if err := s.db.IncrementClicks(shortcode); err != nil {
		return err
	}
	
	// Invalidate cache if available (we'll get fresh data next time)
	if s.cache != nil {
		return s.cache.InvalidateShortcut(shortcode)
	}
	
	return nil
}

// ImportFromJSON imports shortcuts from a JSON file
func (s *CombinedStorage) ImportFromJSON(filename string) error {
	return s.db.ImportFromJSON(filename)
}

// Close closes all connections
func (s *CombinedStorage) Close() {
	if s.db != nil {
		s.db.Close()
	}
	
	if s.cache != nil {
		s.cache.Close()
	}
}

// IsRedisConnected returns true if Redis is connected and available
func (s *CombinedStorage) IsRedisConnected() bool {
	return s.cache != nil
} 