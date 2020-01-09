package tweet

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"../../common"
	"../../common/mongodb"
	"github.com/dgrijalva/jwt-go"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/jwtauth"
	"github.com/go-chi/render"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
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
	// Protected routes
	router.Group(func(r chi.Router) {
		// Seek, verify and validate JWT tokens
		r.Use(jwtauth.Verifier(tokenAuth))
		r.Use(jwtauth.Authenticator)

		r.Get("/api/v1/tweet/search/{searchstring}", SearchTweet)
		r.Get("/api/v1/tweet/getfeed", GetFeed)
		r.Get("/api/v1/tweet/post_tweet", PostTweet)
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
	var response struct {
		result bool
		value  string
	}

	json.Unmarshal(b, &req)

	_, err = mongodb.Tweet.InsertOne(context.TODO(), req)
	if err != nil {
		response.result = false
		response.value = "Insertion failed, MongoDB unavailable at the moment"
		http.Error(w, response.value, 500)
		return
	}

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	response.result = true
	response.value = "Insertion successfull"
	render.JSON(w, r, response)
}

func SearchTweet(w http.ResponseWriter, r *http.Request) {

	b, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var req common.SearchText

	json.Unmarshal(b, &req)

	filter := bson.D{{"$search", req.SearchText}}

	findOptions := options.Find()

	var result []Tweet

	cur, err := mongodb.Tweet.Find(context.TODO(), filter, findOptions)

	if err != nil {
		http.Error(w, err.Error(), 500)
	}

	var x Tweet
	for cur.Next(context.TODO()) {
		err := cur.Decode(&x)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		fmt.Printf("%s", x)
		result = append(result, x)
	}

	render.JSON(w, r, result)
}

func GetFeed(w http.ResponseWriter, r *http.Request) {
	var result []Tweet
	filter := bson.D{}

	cur, err := mongodb.Tweet.Find(context.TODO(), filter)

	if err != nil {
		http.Error(w, err.Error(), 500)
	}

	var x Tweet
	for cur.Next(context.TODO()) {
		err := cur.Decode(&x)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		fmt.Printf("%s", x)
		result = append(result, x)
	}

	render.JSON(w, r, result)
}
