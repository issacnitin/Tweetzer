package tweet

import (
	"bytes"
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
	"github.com/go-chi/cors"
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
	json.Unmarshal(b, &req)
	var response struct {
		result bool
		value  string
	}
	var db DatabaseModal

	_, claims, err2 := jwtauth.FromContext(r.Context())

	if err2 != nil {
		fmt.Printf("%s", err2.Error())
		http.Error(w, err2.Error(), http.StatusBadRequest)
		return
	}

	profileId := fmt.Sprintf("%s", claims["profileid"])
	filter := bson.D{{"profileId", profileId}}
	err = mongodb.Tweet.FindOne(context.TODO(), filter).Decode(&db)
	if err != nil {
		http.Error(w, err.Error(), 500)
	}

	db.Tweets = append(db.Tweets, req)

	_, err = mongodb.Tweet.InsertOne(context.TODO(), db)
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

	profileId, err := GetProfileIdFromClaims(r)
	printError(err, w)
	reqbody, err := json.Marshal(map[string]string{
		"profileId": profileId,
	})
	printError(err, w)

	client := http.Client{
		Timeout: 20000,
	}
	request, err := http.NewRequest("POST", "http://localhost:8081/api/v1/social/getfollowers", bytes.NewBuffer(reqbody))
	request.Header.Set("Content-type", "application/json")
	printError(err, w)

	resp, err := client.Do(request)
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	printError(err, w)
	var followers []string
	json.Unmarshal(body, &followers)

	var result []Tweet
	for follower := range followers {
		filter := bson.D{{"profileId", follower}}
		cur, err := mongodb.Tweet.Find(context.TODO(), filter)
		printError(err, w)
		var x Tweet
		for cur.Next(context.TODO()) {
			err := cur.Decode(&x)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}

			fmt.Printf("%s", x)
			result = append(result, x)
		}
	}

	render.JSON(w, r, result)
}

func GetProfileIdFromClaims(r *http.Request) (string, error) {
	_, claims, err2 := jwtauth.FromContext(r.Context())
	if err2 != nil {
		return "", err2
	}
	profileId := fmt.Sprintf("%s", claims["profileid"])
	return profileId, nil
}

func printError(e error, w http.ResponseWriter) {
	if e != nil {
		http.Error(w, e.Error(), 500)
	}
}
