package social

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi"

	neo4j "../../common/neo4j"
	"github.com/go-chi/jwtauth"
	"github.com/go-chi/render"
)

func Follow(w http.ResponseWriter, r *http.Request) {
	_, claims, err2 := jwtauth.FromContext(r.Context())

	if err2 != nil {
		fmt.Printf("%s", err2.Error())
		http.Error(w, err2.Error(), http.StatusBadRequest)
		return
	}

	username := fmt.Sprintf("%s", claims["username"])
	var followusername = chi.URLParam(r, "followusername")

	fmt.Println(username + " following " + followusername)
	neo4jSession := neo4j.GetSessionWithReadWrite()
	_, err := neo4jSession.Run(
		`MERGE (p:Profile { username: $username1 })
		MERGE (q:Profile { username: $username2 })
		MERGE (p)-[r:FOLLOWING]->(q)-[s:FOLLOWEDBY]->(p)
		RETURN p,q,r,s`, map[string]interface{}{
			"username1": username,
			"username2": followusername,
		})

	if err != nil {
		http.Error(w, err.Error(), 500)
	}

	render.JSON(w, r, "Success")
}

func GetFollowing(w http.ResponseWriter, r *http.Request) {
	username := chi.URLParam(r, "username")
	var followings = []string{}
	neo4jSession := neo4j.GetSessionWithReadWrite()
	result, err := neo4jSession.Run(
		`MATCH (p:Profile { id: $id1 })-[r:FOLLOWING]->(q)
		RETURN q`,
		map[string]interface{}{
			"id1": username,
		})

	if err != nil {
		http.Error(w, "Neo4j Query failed, "+err.Error(), http.StatusInternalServerError)
	} else {
		for result.Next() {
			values := result.Record().Values()
			for _, v := range values {
				followings = append(followings, v.(neo4j.Node).Props()["id"].(string))
			}
		}
		render.JSON(w, r, followings)
	}
}
