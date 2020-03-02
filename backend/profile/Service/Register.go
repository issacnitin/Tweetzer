package profile

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/dgrijalva/jwt-go"

	"../../common"
	"../../common/mongodb"
	"../../common/redis"
	"github.com/go-chi/render"
)

func RegisterUser(w http.ResponseWriter, r *http.Request) {
	b, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var req common.User

	json.Unmarshal(b, &req)
	if (req.Email == "" && req.Username == "") || req.Password == "" {
		http.Error(w, fmt.Sprintf("Need email, phone and password for registration. Recieved %s", req), http.StatusInternalServerError)
		return
	}

	req.ProfileId = GenerateProfileId()
	if req.Username == "" {
		req.Username = _GenerateUsername()
	}

	// BIG TODO: Hash Password
	// TODO: Assuming single email, that need not be the case, user can have multiple emails linked to same account
	// For example, registration with a non google email and trying to register later with a google email
	_, err = mongodb.Profile.InsertOne(context.TODO(), req)
	if err != nil {
		http.Error(w, "Registration failed, MongoDB unavailable at the moment", 500)
		return
	}

	redis.Instance.Set(req.Username, true, 999999999999)

	claims := jwt.MapClaims{
		"profileid": req.ProfileId,
	}

	_, token, err := tokenAuth.Encode(claims)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	fmt.Printf("%s", token)

	var response common.Token
	response.Token = token
	render.JSON(w, r, response)
}
