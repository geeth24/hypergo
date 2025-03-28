package storage

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"hypergo/internal/models"
)

// PostgresStorage handles the persistence of shortcuts using PostgreSQL
type PostgresStorage struct {
	db *pgxpool.Pool
}

// NewPostgres creates a new PostgreSQL storage instance
func NewPostgres(databaseURL string) (*PostgresStorage, error) {
	ctx := context.Background()
	
	// Connect to the database
	db, err := pgxpool.New(ctx, databaseURL)
	if err != nil {
		return nil, fmt.Errorf("unable to connect to database: %v", err)
	}
	
	// Make sure we can connect
	if err := db.Ping(ctx); err != nil {
		return nil, fmt.Errorf("unable to ping database: %v", err)
	}

	s := &PostgresStorage{
		db: db,
	}

	// Initialize the database schema if it doesn't exist
	if err := s.initSchema(ctx); err != nil {
		return nil, err
	}

	return s, nil
}

// initSchema initializes the database schema
func (s *PostgresStorage) initSchema(ctx context.Context) error {
	_, err := s.db.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS shortcuts (
			shortcode TEXT PRIMARY KEY,
			url TEXT NOT NULL,
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			clicks INTEGER NOT NULL DEFAULT 0
		)
	`)
	return err
}

// ImportFromJSON imports shortcuts from a JSON file
func (s *PostgresStorage) ImportFromJSON(filename string) error {
	data, err := os.ReadFile(filename)
	if err != nil {
		return fmt.Errorf("unable to read shortcuts file: %v", err)
	}

	shortcuts := models.Shortcuts{}
	if err := json.Unmarshal(data, &shortcuts); err != nil {
		return fmt.Errorf("unable to parse shortcuts file: %v", err)
	}

	// If there are no shortcuts to import, exit early
	if len(shortcuts) == 0 {
		return nil
	}
	
	// Check if the database already has shortcuts
	ctx := context.Background()
	var count int
	err = s.db.QueryRow(ctx, "SELECT COUNT(*) FROM shortcuts").Scan(&count)
	if err != nil {
		return fmt.Errorf("unable to check existing shortcuts: %v", err)
	}
	
	// If there are already shortcuts in the database, ask for confirmation before overwriting
	if count > 0 {
		log.Printf("Warning: Database already contains %d shortcuts", count)
		log.Printf("Imported shortcuts will be merged with existing ones")
		log.Printf("Shortcuts with the same shortcode will be updated")
	}
	
	// Start a transaction for the import
	tx, err := s.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("unable to start transaction: %v", err)
	}
	defer tx.Rollback(ctx) // Will be a no-op if transaction is committed
	
	imported := 0
	skipped := 0
	
	for shortcode, shortcut := range shortcuts {
		// Parse the timestamp
		createdAt, err := time.Parse(time.RFC3339, shortcut.CreatedAt)
		if err != nil {
			// Use current time if parsing fails
			createdAt = time.Now()
		}
		
		// First check if the shortcode already exists
		var existingURL string
		err = tx.QueryRow(ctx, `
			SELECT url FROM shortcuts WHERE shortcode = $1
		`, shortcode).Scan(&existingURL)
		
		if err == nil {
			// Shortcode exists, update it
			_, err = tx.Exec(ctx, `
				UPDATE shortcuts 
				SET url = $2, created_at = $3, clicks = $4
				WHERE shortcode = $1
			`, shortcode, shortcut.URL, createdAt, shortcut.Clicks)
			
			if err != nil {
				return fmt.Errorf("unable to update shortcut %s: %v", shortcode, err)
			}
			skipped++
		} else {
			// Shortcode doesn't exist, insert it
			_, err = tx.Exec(ctx, `
				INSERT INTO shortcuts (shortcode, url, created_at, clicks)
				VALUES ($1, $2, $3, $4)
			`, shortcode, shortcut.URL, createdAt, shortcut.Clicks)
			
			if err != nil {
				return fmt.Errorf("unable to import shortcut %s: %v", shortcode, err)
			}
			imported++
		}
	}

	// Commit the transaction
	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("unable to commit transaction: %v", err)
	}
	
	log.Printf("Import completed: %d shortcuts imported, %d updated", imported, skipped)
	return nil
}

// GetAll returns all shortcuts
func (s *PostgresStorage) GetAll() models.Shortcuts {
	ctx := context.Background()
	
	rows, err := s.db.Query(ctx, `
		SELECT shortcode, url, created_at, clicks
		FROM shortcuts
		ORDER BY created_at DESC
	`)
	if err != nil {
		// Return empty map if there's an error
		return models.Shortcuts{}
	}
	defer rows.Close()
	
	shortcuts := models.Shortcuts{}
	
	for rows.Next() {
		var shortcode string
		var url string
		var createdAt time.Time
		var clicks int
		
		if err := rows.Scan(&shortcode, &url, &createdAt, &clicks); err != nil {
			continue
		}
		
		shortcuts[shortcode] = models.Shortcut{
			URL:       url,
			CreatedAt: createdAt.Format(time.RFC3339),
			Clicks:    clicks,
		}
	}
	
	return shortcuts
}

// Get returns a shortcut by shortcode
func (s *PostgresStorage) Get(shortcode string) (models.Shortcut, bool) {
	ctx := context.Background()
	
	var url string
	var createdAt time.Time
	var clicks int
	
	err := s.db.QueryRow(ctx, `
		SELECT url, created_at, clicks
		FROM shortcuts
		WHERE shortcode = $1
	`, shortcode).Scan(&url, &createdAt, &clicks)
	
	if err != nil {
		return models.Shortcut{}, false
	}
	
	return models.Shortcut{
		URL:       url,
		CreatedAt: createdAt.Format(time.RFC3339),
		Clicks:    clicks,
	}, true
}

// Create adds a new shortcut
func (s *PostgresStorage) Create(shortcode string, shortcut models.Shortcut) error {
	ctx := context.Background()
	
	// Parse the timestamp if it exists, otherwise use current time
	var createdAt time.Time
	if shortcut.CreatedAt != "" {
		var err error
		createdAt, err = time.Parse(time.RFC3339, shortcut.CreatedAt)
		if err != nil {
			createdAt = time.Now()
		}
	} else {
		createdAt = time.Now()
	}
	
	_, err := s.db.Exec(ctx, `
		INSERT INTO shortcuts (shortcode, url, created_at, clicks)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (shortcode) DO UPDATE
		SET url = $2, created_at = $3, clicks = $4
	`, shortcode, shortcut.URL, createdAt, shortcut.Clicks)
	
	return err
}

// Update updates an existing shortcut
func (s *PostgresStorage) Update(shortcode string, shortcut models.Shortcut) error {
	return s.Create(shortcode, shortcut)
}

// IncrementClicks increases the click count for a shortcut
func (s *PostgresStorage) IncrementClicks(shortcode string) error {
	ctx := context.Background()
	
	_, err := s.db.Exec(ctx, `
		UPDATE shortcuts
		SET clicks = clicks + 1
		WHERE shortcode = $1
	`, shortcode)
	
	return err
}

// Close closes the database connection
func (s *PostgresStorage) Close() {
	if s.db != nil {
		s.db.Close()
	}
} 