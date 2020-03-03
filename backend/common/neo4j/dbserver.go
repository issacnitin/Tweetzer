package neo4j

import (
	"fmt"

	"github.com/neo4j/neo4j-go-driver/neo4j"
)

var Instance neo4j.Session

func openDB() neo4j.Session {
	driver, err := neo4j.NewDriver("bolt://neo4jdb:7687", neo4j.BasicAuth("neo4j", "abc", ""))
	if err != nil {
		fmt.Printf("%s", err)
	}
	defer driver.Close()

	Instance, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		fmt.Printf("%s", err)
	}
	return Instance
}

func init() {
	openDB()
}
