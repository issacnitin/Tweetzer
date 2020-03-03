package profile

import (
	"context"
	"fmt"
	"net/http"

	"../../common"
	"../../common/mongodb"
	"../../common/redis"
	"github.com/dgrijalva/jwt-go"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/jwtauth"
	"github.com/go-chi/render"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

		r.Get("/api/v1/profile/search/{searchstring}", SearchUser)
		r.Get("/api/v1/profile/getme", GetMe)
		r.Get("/api/v1/profile/getprofile/{profileId}", GetProfile)
		r.Get("/api/v1/profile/getuserwithusername/{username}", GetUserWithUsername)
	})

	// Public routes
	router.Group(func(r chi.Router) {
		r.Post("/api/v1/profile/register", RegisterUser)
		r.Post("/api/v1/profile/login", LoginUser)
	})

	return router
}

func GetProfileId(w http.ResponseWriter, r *http.Request) {
	_, claims, err2 := jwtauth.FromContext(r.Context())

	if err2 != nil {
		fmt.Printf("%s", err2.Error())
		http.Error(w, err2.Error(), http.StatusBadRequest)
		return
	}

	profileId := fmt.Sprintf("%s", claims["profileid"])

	var response struct {
		ProfileId string `json:"profileId"`
	}
	response.ProfileId = profileId

	render.JSON(w, r, response)
}

func UsernameExist(w http.ResponseWriter, r *http.Request) {
	ss := fmt.Sprintf("%s", chi.URLParam(r, "username"))
	_, err := redis.Instance.Get(ss).Result()

	var response struct {
		Result bool `json:"Result"`
	}
	response.Result = err != nil
	render.JSON(w, r, response)
	return
}

func GetUserWithUsername(w http.ResponseWriter, r *http.Request) {

	ss := fmt.Sprintf("%s", chi.URLParam(r, "username"))

	filter := bson.D{
		{"username", ss},
	}

	var result common.User

	err := mongodb.Profile.FindOne(context.TODO(), filter).Decode(&result)
	result.Password = ""
	result.Phone = ""
	result.Email = ""

	if err != nil {
		http.Error(w, err.Error(), http.StatusGone)
		return
	}

	render.JSON(w, r, result)
}

func GetMe(w http.ResponseWriter, r *http.Request) {

	_, claims, err2 := jwtauth.FromContext(r.Context())

	if err2 != nil {
		fmt.Printf("%s", err2.Error())
		return
	}

	profileId := claims["profileid"]
	filter := bson.D{{"profileid", profileId}}

	var result common.User

	err := mongodb.Profile.FindOne(context.TODO(), filter).Decode(&result)
	result.Password = ""

	if err != nil {
		http.Error(w, err.Error(), http.StatusGone)
	}

	render.JSON(w, r, result)
}

func GetProfile(w http.ResponseWriter, r *http.Request) {
	var req struct {
		profileId string `json:"profileId" bson:"profileId"`
	}
	req.profileId = chi.URLParam(r, "profileId")
	filter := bson.D{{"profileid", req.profileId}}

	var result common.User

	// TODO: Hide necessary things
	err := mongodb.Profile.FindOne(context.TODO(), filter).Decode(&result)
	result.Password = ""
	result.Email = ""

	if err != nil {
		http.Error(w, err.Error(), http.StatusGone)
	}

	render.JSON(w, r, result)
}

// Untested
func SearchUser(w http.ResponseWriter, r *http.Request) {

	fmt.Sprintf("FindUser called")
	ss := fmt.Sprintf("%s", chi.URLParam(r, "searchstring"))
	ss = fmt.Sprintf(".*%s.*", ss)

	filter := bson.D{
		{"$or", bson.D{
			{"name", primitive.Regex{ss, ""}},
			{"country", ss},
			{"phone", ss},
		}}}
	findOptions := options.Find()

	var result []common.User

	cur, err := mongodb.Profile.Find(context.TODO(), filter, findOptions)

	if err != nil {
		http.Error(w, err.Error(), 500)
	}

	var x common.User
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
