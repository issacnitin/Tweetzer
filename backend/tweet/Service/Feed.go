package tweet

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"

	"../../common/mongodb"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetFeed(w http.ResponseWriter, r *http.Request) {
	username, err := GetUsernameFromClaims(r)
	printError(err, w)
	reqbody, err := json.Marshal(map[string]interface{}{
		"username": username,
	})
	printError(err, w)

	client := http.Client{}
	token := GetTokenFromClaims(r)
	if len(token) == 0 {
		http.Error(w, "Failed to get token from request header", http.StatusInternalServerError)
	}
	req, err := http.NewRequest("GET", "http://social:8083/api/v1/social/getfollowing/"+username, bytes.NewBuffer(reqbody))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", token)
	resp, err := client.Do(req)

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	printError(err, w)
	var following []string
	json.Unmarshal(body, &following)

	following = append(following, username)

	var limit int64 = 10
	l, err := strconv.ParseInt(chi.URLParam(r, "page"), 10, 64)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	var skip int64 = l * limit
	findOptions := options.Find()
	findOptions.Skip = &skip
	findOptions.Limit = &limit

	var result []Tweet
	for _, follower := range following {
		fmt.Println(follower)
		filter := bson.D{{"username", follower}}
		cur, err := mongodb.Tweet.Find(context.TODO(), filter, findOptions)
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
