package social

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

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

	profileId := fmt.Sprintf("%s", claims["profileid"])

	var req struct {
		followId string `json:"follow"`
	}

	b, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()
	json.Unmarshal(b, &req)

	if err != nil {
		http.Error(w, "Some error", 500)
	}

	neo4jSession := neo4j.GetSessionWithReadWrite()
	_, err = neo4jSession.Run(
		`MERGE (p:Profile { id: $id1 })
		MERGE (q:Profile { id: $id2 })
		MERGE (p)-[r:FOLLOWING]->(q)<-[s:FOLLOWEDBY]-(p)
		RETURN p,q,r,s`, map[string]interface{}{
			"id1": profileId,
			"id2": req.followId,
		})

	if err != nil {
		http.Error(w, err.Error(), 500)
	}

	render.JSON(w, r, "Success")
}

func GetFollowing(w http.ResponseWriter, r *http.Request) {
	var req struct {
		profileId string `json:"profileId"`
	}
	b, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	defer r.Body.Close()
	json.Unmarshal(b, &req)

	profileId := req.profileId

	var followings []string
	neo4jSession := neo4j.GetSessionWithReadWrite()
	result, err := neo4jSession.Run(
		`MATCH (p:Profile { id: $id1 })-[r:FOLLOWING]->(q) \
		RETURN q`,
		map[string]interface{}{
			"id1": profileId,
		})

	if err != nil {
		http.Error(w, "Neo4j Query failed", http.StatusInternalServerError)
	} else {
		for result.Next() {
			followings = append(followings, result.Record().GetByIndex(1).(string))
		}
		render.JSON(w, r, followings)
	}
}
