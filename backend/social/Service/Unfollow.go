package social

import (
	"fmt"
	"net/http"

	neo4j "../../common/neo4j"
	"github.com/go-chi/chi"
	"github.com/go-chi/jwtauth"
	"github.com/go-chi/render"
)

func UnFollow(w http.ResponseWriter, r *http.Request) {
	_, claims, err2 := jwtauth.FromContext(r.Context())

	if err2 != nil {
		fmt.Printf("%s", err2.Error())
		http.Error(w, err2.Error(), http.StatusBadRequest)
		return
	}

	username := fmt.Sprintf("%s", claims["username"])
	unfollowusername := chi.URLParam(r, "username")

	fmt.Println(username + "    " + unfollowusername)
	neo4jSession := neo4j.GetSessionWithReadWrite()
	_, err := neo4jSession.Run(
		`MATCH (p:Profile { username: $username1 })-[r:FOLLOWING]->(q:Profile { username: $username2 })
		MATCH (s:Profile { username: $username2 })-[u:FOLLOWEDBY]->(t:Profile { username: $username1 })
		DELETE r, u`,
		map[string]interface{}{
			"username1": username,
			"username2": unfollowusername,
		})
	if err != nil {
		http.Error(w, err.Error(), 500)
	}

	render.JSON(w, r, "Success")
}

func GetFollowers(w http.ResponseWriter, r *http.Request) {
	username := chi.URLParam(r, "username")
	var followings = []string{}
	neo4jSession := neo4j.GetSessionWithReadWrite()
	result, err := neo4jSession.Run(
		`MATCH (p:Profile { username: $username1 })-[r:FOLLOWEDBY]->(q)
		RETURN q`,
		map[string]interface{}{
			"username1": username,
		})

	if err != nil {
		http.Error(w, "Neo4j Query failed, "+err.Error(), http.StatusInternalServerError)
	} else {
		for result.Next() {
			values := result.Record().Values()
			for _, v := range values {
				followings = append(followings, v.(neo4j.Node).Props()["username"].(string))
			}
		}
		render.JSON(w, r, followings)
	}
}
