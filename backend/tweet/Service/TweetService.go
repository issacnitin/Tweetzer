package tweet

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"time"

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
		r.Get("/api/v1/tweet/feed", GetFeed)
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

	// profileID := fmt.Sprintf("%s", claims["profileid"])
	// findFilter := bson.D{{"profileId", profileID}}
	// updateFilter := bson.M{"$push": bson.M{"tweets": req}}
	// var options options.UpdateOptions
	// var bb bool = true
	// options.Upsert = &bb
	// _, err = mongodb.Tweet.UpdateOne(context.TODO(), findFilter, updateFilter, &options)
	req.ProfileId = fmt.Sprintf("%s", claims["profileid"])
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

func GetFeed(w http.ResponseWriter, r *http.Request) {

	profileId, err := GetProfileIdFromClaims(r)
	printError(err, w)
	reqbody, err := json.Marshal(map[string]interface{}{
		"profileId": profileId,
	})
	printError(err, w)

	client := http.Client{}
	token := GetTokenFromClaims(r)
	if len(token) == 0 {
		http.Error(w, "Failed to get token from request header", http.StatusInternalServerError)
	}
	req, err := http.NewRequest("GET", "http://social:8082/api/v1/social/getfollowing", bytes.NewBuffer(reqbody))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)
	resp, err := client.Do(req)

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	printError(err, w)
	var following []string
	json.Unmarshal(body, &following)

	following = append(following, profileId)

	var result []Tweet
	for _, follower := range following {
		fmt.Println(follower)
		filter := bson.D{{"profileId", follower}}
		cur, err := mongodb.Tweet.Find(context.TODO(), filter)
		if err == nil {
			var x Tweet
			for cur.Next(context.TODO()) {
				err := cur.Decode(&x)
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
				}

				fmt.Printf("%s", x)
				result = append(result, x)
			}
		} else {
			fmt.Println("Error found fetching tweets")
		}
	}

	render.JSON(w, r, result)
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

func GetProfileIdFromClaims(r *http.Request) (string, error) {
	_, claims, err2 := jwtauth.FromContext(r.Context())
	if err2 != nil {
		return "", err2
	}
	profileId := fmt.Sprintf("%s", claims["profileid"])
	return profileId, nil
}

func GetTokenFromClaims(r *http.Request) string {
	reqToken := r.Header.Get("Authorization")
	splitToken := strings.Split(reqToken, "Bearer")
	if len(splitToken) < 2 {
		return ""
	}
	reqToken = splitToken[1]
	fmt.Println(reqToken)
	return reqToken
}

func printError(e error, w http.ResponseWriter) {
	if e != nil {
		http.Error(w, e.Error(), 500)
	}
}
