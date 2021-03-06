package tweet

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"../../common"
	"../../common/mongodb"
	"../../common/redis"
	"github.com/dgrijalva/jwt-go"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/jwtauth"
	"github.com/go-chi/render"
)

var tokenAuth *jwtauth.JWTAuth

func init() {
	tokenAuth = jwtauth.New("HS256", []byte(common.JWT_SECRET_KEY), nil)

	// For debugging/example purposes, we generate and print
	// a sample jwt token with claims `user_id:123` here:
	_, tokenString, _ := tokenAuth.Encode(jwt.MapClaims{"user_id": 123})
	fmt.Printf("DEBUG: a sample jwt is %s\n\n", tokenString)
}

func Routes() *chi.Mux {
	router := chi.NewRouter()

	router.Use(middleware.Recoverer)
	router.Use(middleware.Logger)

	cors := cors.New(cors.Options{
		// AllowedOrigins: []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	})
	router.Use(cors.Handler)
	router.Use(redis.RateLimit(10))
	// Protected routes
	router.Group(func(r chi.Router) {
		// Seek, verify and validate JWT tokens
		r.Use(jwtauth.Verifier(tokenAuth))
		r.Use(jwtauth.Authenticator)

		r.Get("/api/v1/tweet/feed/{page}", GetFeed)
		r.Get("/api/v1/tweet/fetch/{username}/{page}", FetchTweets)
		r.Get("/api/v1/tweet/search/{searchtext}/{page}", SearchTweets)
		r.Post("/api/v1/tweet/post", PostTweet)
	})

	// Public routes
	router.Group(func(r chi.Router) {

	})

	return router
}

func PostTweet(w http.ResponseWriter, r *http.Request) {
	b, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var req Tweet
	json.Unmarshal(b, &req)
	req.Timestamp = time.Now().Unix()

	var response struct {
		result bool
		value  string
	}

	_, claims, err2 := jwtauth.FromContext(r.Context())

	if err2 != nil {
		fmt.Printf("%s", err2.Error())
		http.Error(w, err2.Error(), http.StatusBadRequest)
		return
	}

	// username := fmt.Sprintf("%s", claims["username"])
	// findFilter := bson.D{{"username", username}}
	// updateFilter := bson.M{"$push": bson.M{"tweets": req}}
	// var options options.UpdateOptions
	// var bb bool = true
	// options.Upsert = &bb
	// _, err = mongodb.Tweet.UpdateOne(context.TODO(), findFilter, updateFilter, &options)
	req.Username = fmt.Sprintf("%s", claims["username"])
	_, err = mongodb.Tweet.InsertOne(context.TODO(), req)
	if err != nil {
		response.result = false
		response.value = "Insertion failed, MongoDB unavailable at the moment"
		http.Error(w, response.value, http.StatusInternalServerError)
		return
	}

	response.result = true
	response.value = "Insertion successfull"
	render.JSON(w, r, response)
}

func GetUsernameFromClaims(r *http.Request) (string, error) {
	_, claims, err2 := jwtauth.FromContext(r.Context())
	if err2 != nil {
		return "", err2
	}
	username := fmt.Sprintf("%s", claims["username"])
	return username, nil
}

func GetTokenFromClaims(r *http.Request) string {
	reqToken := r.Header.Get("Authorization")
	fmt.Println(reqToken)
	return reqToken
}

func printError(e error, w http.ResponseWriter) {
	if e != nil {
		http.Error(w, e.Error(), 500)
	}
}
