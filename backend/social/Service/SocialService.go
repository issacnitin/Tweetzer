package social

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"../../common"
	mongodb "../../common/mongodb"
	"github.com/dgrijalva/jwt-go"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/jwtauth"
	"github.com/go-chi/render"
	"go.mongodb.org/mongo-driver/bson"
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

		r.Post("/api/v1/social/follow", Follow)
		r.Post("/api/v1/social/unfollow", UnFollow)
	})

	// Public routes
	router.Group(func(r chi.Router) {
		r.Get("/api/v1/social/getfollowers", GetFollowers)
		r.Get("/api/v1/social/getfollowing", GetFollowing)
	})

	return router
}

func Follow(w http.ResponseWriter, r *http.Request) {
	_, claims, err2 := jwtauth.FromContext(r.Context())

	if err2 != nil {
		fmt.Printf("%s", err2.Error())
		http.Error(w, err2.Error(), http.StatusBadRequest)
		return
	}

	profileId := fmt.Sprintf("%s", claims["profileid"])

	var req struct {
		followId string `json:"follow"`
	}

	b, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()
	json.Unmarshal(b, &req)

	if err != nil {
		http.Error(w, "Some error", 500)
	}

	// TODO: Handle concurrency issues
	var rr DatabaseModal

	filter := bson.D{{"profileId", req.followId}}
	err = mongodb.Social.FindOne(context.TODO(), filter).Decode(&rr)
	if err != nil {
		http.Error(w, err.Error(), 500)
	}
	rr.followedby = append(rr.followedby, profileId)
	// Non atomic operation, TODO
	_, err = mongodb.Social.InsertOne(context.TODO(), req)
	if err != nil {
		http.Error(w, "Insertion Failed, MongoDB unavailable at the moment", 500)
		return
	}

	filter = bson.D{{"profileId", profileId}}
	err = mongodb.Social.FindOne(context.TODO(), filter).Decode(&rr)
	if err != nil {
		http.Error(w, err.Error(), 500)
	}
	rr.following = append(rr.following, profileId)
	// Non atomic operation, TODO
	_, err = mongodb.Social.InsertOne(context.TODO(), req)
	if err != nil {
		http.Error(w, "Insertion Failed, MongoDB unavailable at the moment", 500)
		return
	}

	render.JSON(w, r, "Success")
}

func UnFollow(w http.ResponseWriter, r *http.Request) {
	_, claims, err2 := jwtauth.FromContext(r.Context())

	if err2 != nil {
		fmt.Printf("%s", err2.Error())
		http.Error(w, err2.Error(), http.StatusBadRequest)
		return
	}

	profileId := fmt.Sprintf("%s", claims["profileid"])

	var req struct {
		followId string `json:"follow"`
	}

	b, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()
	json.Unmarshal(b, &req)

	if err != nil {
		http.Error(w, "Some error", 500)
	}

	// TODO: Handle concurrency issues
	var rr DatabaseModal

	filter := bson.D{{"profileId", req.followId}}
	err = mongodb.Social.FindOne(context.TODO(), filter).Decode(&rr)
	if err != nil {
		http.Error(w, err.Error(), 500)
	}
	for i, v := range rr.followedby {
		if v == profileId {
			rr.followedby = append(rr.following[:i], rr.following[i+1:]...)
			break
		}
	}

	// Non atomic operation, TODO
	_, err = mongodb.Social.InsertOne(context.TODO(), req)
	if err != nil {
		http.Error(w, "Insertion Failed, MongoDB unavailable at the moment", 500)
		return
	}

	filter = bson.D{{"profileId", profileId}}
	err = mongodb.Social.FindOne(context.TODO(), filter).Decode(&rr)
	if err != nil {
		http.Error(w, err.Error(), 500)
	}
	for i, v := range rr.followedby {
		if v == profileId {
			rr.following = append(rr.following[:i], rr.following[i+1:]...)
			break
		}
	}

	// Non atomic operation, TODO
	_, err = mongodb.Social.InsertOne(context.TODO(), req)
	if err != nil {
		http.Error(w, "Insertion Failed, MongoDB unavailable at the moment", 500)
		return
	}

	render.JSON(w, r, "Success")
}

func GetFollowers(w http.ResponseWriter, r *http.Request) {
	var req struct {
		profileId string `json:"profileId"`
	}

	b, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()
	json.Unmarshal(b, &req)

	profileId := req.profileId

	var rr DatabaseModal
	filter := bson.D{{"profileId", profileId}}
	err = mongodb.Social.FindOne(context.TODO(), filter).Decode(&rr)
	if err != nil {
		http.Error(w, err.Error(), 500)
	}

	render.JSON(w, r, rr.followedby)
}

func GetFollowing(w http.ResponseWriter, r *http.Request) {
	var req struct {
		profileId string `json:"profileId"`
	}

	b, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()
	json.Unmarshal(b, &req)

	profileId := req.profileId

	var rr DatabaseModal
	filter := bson.D{{"profileId", profileId}}
	err = mongodb.Social.FindOne(context.TODO(), filter).Decode(&rr)
	if err != nil {
		http.Error(w, err.Error(), 500)
	}

	render.JSON(w, r, rr.following)
}
