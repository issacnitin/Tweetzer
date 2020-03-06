package redis

import (
	"github.com/go-redis/redis"
	redis_rate "github.com/go-redis/redis_rate"
)

type Nil redis.Nil

// Instance : Singleton Instance
var Instance *redis.Client
var Limiter *redis_rate.Limiter

// GeoLocation : redis.GeoLocation
type GeoLocation = redis.GeoLocation

// GeoRadiusQuery : redis.GeoRadiusQuery
type GeoRadiusQuery = redis.GeoRadiusQuery

func openDB() {
	Instance = redis.NewClient(&redis.Options{
		Addr:     "redis:6379",
		Password: "SomePassword1234", // no password set
		DB:       0,                  // use default DB
	})

	Limiter = redis_rate.NewLimiter(Instance)
}

func init() {
	openDB()
}
