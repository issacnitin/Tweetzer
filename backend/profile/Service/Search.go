package profile

import (
	"context"
	"fmt"
	"net/http"

	"../../common"
	"../../common/mongodb"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func SearchUser(w http.ResponseWriter, r *http.Request) {
	ss := fmt.Sprintf(".*%s.*", chi.URLParam(r, "searchstring"))

	filter := bson.M{
		"$or": bson.A{
			bson.M{"name": bson.M{"$regex": ss}},
			bson.M{"username": bson.M{"$regex": ss}},
		}}
	findOptions := options.Find()

	var result []common.User

	cur, err := mongodb.Profile.Find(context.TODO(), filter, findOptions)

	if err != nil {
		http.Error(w, err.Error(), 500)
		return
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
