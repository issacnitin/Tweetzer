package tweet

import (
	"context"
	"fmt"
	"net/http"

	"../../common/mongodb"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func SearchTweets(w http.ResponseWriter, r *http.Request) {

	var text string = chi.URLParam(r, "searchtext")
	var result []Tweet
	filter := bson.M{"$text": bson.M{"$search": primitive.Regex{Pattern: ".*" + text + ".*", Options: ""}}}
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
