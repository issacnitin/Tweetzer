package social

import (
	"fmt"
	"net/http"

	neo4j "../../common/neo4j"
	"github.com/go-chi/chi"
	"github.com/go-chi/jwtauth"
	"github.com/go-chi/render"
)

func GetAmIFollowing(w http.ResponseWriter, r *http.Request) {
	_, claims, err2 := jwtauth.FromContext(r.Context())

	if err2 != nil {
		fmt.Printf("%s", err2.Error())
		http.Error(w, err2.Error(), http.StatusBadRequest)
		return
	}

	username := fmt.Sprintf("%s", claims["username"])
	var followusername = chi.URLParam(r, "username")
	neo4jSession := neo4j.GetSessionWithReadWrite()
	result, err := neo4jSession.Run(
		`MATCH (p:Profile { username: $username1 })
		MATCH (q:Profile { username: $username2 })
		RETURN EXISTS( (p)-[:FOLLOWING]-(b) )`, map[string]interface{}{
			"username1": username,
			"username2": followusername,
		})

	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	for result.Next() {
		render.JSON(w, r, "Success")
		return
	}
	return
}
