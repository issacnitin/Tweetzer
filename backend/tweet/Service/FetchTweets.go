package tweet

import (
	"context"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi"

	"../../common/mongodb"
	"github.com/go-chi/render"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func FetchTweets(w http.ResponseWriter, r *http.Request) {
	var req struct {
		username string `json:"username" bson:"username"`
	}
	req.username = chi.URLParam(r, "username")
	var result []Tweet
	filter := bson.D{{"username", req.username}}
	var limit int64 = 10
	l, err := strconv.ParseInt(chi.URLParam(r, "page"), 10, 64)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	var skip int64 = l * limit
	findOptions := options.Find()
	findOptions.Skip = &skip
	findOptions.Limit = &limit
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
	}
	render.JSON(w, r, result)
}
