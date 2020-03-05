package redis

import (
	"net/http"

	redis_rate "github.com/go-redis/redis_rate"
)

func RateLimit(limit int) func(http.Handler) http.Handler {

	return func(next http.Handler) http.Handler {
		fn := func(w http.ResponseWriter, r *http.Request) {
			res, err := Limiter.Allow(r.RemoteAddr, redis_rate.PerSecond(limit))
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			if !res.Allowed {
				http.Error(w, err.Error(), http.StatusTooManyRequests)
			}
			next.ServeHTTP(w, r)
		}
		return http.HandlerFunc(fn)
	}
}
