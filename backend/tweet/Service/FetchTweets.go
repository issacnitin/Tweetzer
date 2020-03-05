package tweet

import (
	"context"
	"fmt"
	"net/http"

	"github.com/go-chi/chi"

	"../../common/mongodb"
	"github.com/go-chi/render"
	"go.mongodb.org/mongo-driver/bson"
)

func FetchTweets(w http.ResponseWriter, r *http.Request) {
	var req struct {
		username string `json:"username" bson:"username"`
	}
	req.username = chi.URLParam(r, "username")
	var result []Tweet
	filter := bson.D{{"username", req.username}}
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
	}
	render.JSON(w, r, result)
}
