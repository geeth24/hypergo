package storage

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/go-redis/redis/v8"
	"hypergo/internal/models"
)

// RedisCache handles caching of shortcuts using Redis
type RedisCache struct {
	client *redis.Client
	ctx    context.Context
}

// NewRedisCache creates a new Redis cache instance
func NewRedisCache(url, password string, db int) (*RedisCache, error) {
	ctx := context.Background()
	
	client := redis.NewClient(&redis.Options{
		Addr:     url,
		Password: password,
		DB:       db,
	})
	
	// Make sure we can connect
	if err := client.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("unable to connect to Redis: %v", err)
	}
	
	return &RedisCache{
		client: client,
		ctx:    ctx,
	}, nil
}

// GetShortcut gets a shortcut from the cache
func (r *RedisCache) GetShortcut(shortcode string) (models.Shortcut, bool) {
	key := fmt.Sprintf("shortcut:%s", shortcode)
	
	data, err := r.client.Get(r.ctx, key).Bytes()
	if err != nil {
		return models.Shortcut{}, false
	}
	
	var shortcut models.Shortcut
	if err := json.Unmarshal(data, &shortcut); err != nil {
		return models.Shortcut{}, false
	}
	
	return shortcut, true
}

// SetShortcut sets a shortcut in the cache
func (r *RedisCache) SetShortcut(shortcode string, shortcut models.Shortcut) error {
	key := fmt.Sprintf("shortcut:%s", shortcode)
	
	data, err := json.Marshal(shortcut)
	if err != nil {
		return err
	}
	
	// Cache for 1 hour
	return r.client.Set(r.ctx, key, data, time.Hour).Err()
}

// InvalidateShortcut removes a shortcut from the cache
func (r *RedisCache) InvalidateShortcut(shortcode string) error {
	key := fmt.Sprintf("shortcut:%s", shortcode)
	return r.client.Del(r.ctx, key).Err()
}

// Close closes the Redis connection
func (r *RedisCache) Close() {
	if r.client != nil {
		r.client.Close()
	}
} 