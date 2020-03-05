package profile

import (
	"context"
	"fmt"
	"net/http"
	"strconv"

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

	var limit int64 = 10
	l, err := strconv.ParseInt(chi.URLParam(r, "page"), 10, 64)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	var skip int64 = l * limit
	findOptions := options.Find()
	findOptions.Skip = &skip
	findOptions.Limit = &limit

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
