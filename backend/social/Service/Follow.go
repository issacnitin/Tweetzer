package social

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
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

	profileId := fmt.Sprintf("%s", claims["profileid"])
	var followid = chi.URLParam(r, "followid")

	fmt.Println(profileId + " following " + followid)
	neo4jSession := neo4j.GetSessionWithReadWrite()
	_, err := neo4jSession.Run(
		`MERGE (p:Profile { id: $id1 })
		MERGE (q:Profile { id: $id2 })
		MERGE (p)-[r:FOLLOWING]->(q)-[s:FOLLOWEDBY]->(p)
		RETURN p,q,r,s`, map[string]interface{}{
			"id1": profileId,
			"id2": followid,
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

	var profileId string = ""
	if len(req.profileId) == 0 {
		_, claims, err2 := jwtauth.FromContext(r.Context())
		if err2 != nil {
			http.Error(w, err2.Error(), http.StatusInternalServerError)
		}
		profileId = fmt.Sprintf("%s", claims["profileid"])
	} else {
		profileId = req.profileId
	}

	fmt.Println(profileId)
	var followings = []string{}
	neo4jSession := neo4j.GetSessionWithReadWrite()
	result, err := neo4jSession.Run(
		`MATCH (p:Profile { id: $id1 })-[r:FOLLOWING]->(q)
		RETURN q`,
		map[string]interface{}{
			"id1": profileId,
		})

	if err != nil {
		http.Error(w, "Neo4j Query failed", http.StatusInternalServerError)
	} else {
		fmt.Println("%s", result)
		for result.Next() {
			followings = append(followings, result.Record().GetByIndex(1).(string))
		}
		render.JSON(w, r, followings)
	}
}
