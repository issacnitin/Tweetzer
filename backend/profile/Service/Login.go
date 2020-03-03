package profile

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"../../common"
	"../../common/mongodb"
	"github.com/dgrijalva/jwt-go"
	"github.com/go-chi/render"
	"go.mongodb.org/mongo-driver/bson"
)

func LoginUser(w http.ResponseWriter, r *http.Request) {

	b, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var req LoginUserRequest
	json.Unmarshal(b, &req)

	fmt.Println(req.Username)
	filter := bson.D{
		{"username", req.Username},
	}

	var profileInDB common.User
	profileDb := mongodb.GetCollection("profile")
	err = profileDb.FindOne(context.TODO(), filter).Decode(&profileInDB)

	if err != nil {
		http.Error(w, "Login failed, user not found", http.StatusBadRequest)
		return
	}

	if profileInDB.Password != req.Password {
		http.Error(w, "Login failed due to password mismatch", http.StatusBadRequest)
		return
	}

	claim := jwt.MapClaims{"profileid": profileInDB.ProfileId}

	_, token, err := tokenAuth.Encode(claim)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("%s", token)
	var response common.Token
	response.Token = token
	render.JSON(w, r, response)
}
