package neo4j

import (
	"fmt"

	"github.com/neo4j/neo4j-go-driver/neo4j"
)

type Node neo4j.Node

func GetSessionWithReadWrite() neo4j.Session {
	driver, err := neo4j.NewDriver("bolt://127.0.0.1:7687", neo4j.BasicAuth("neo4j", "abc", ""))
	if err != nil {
		fmt.Printf("%s", err)
		return nil
	}

	Instance, err := driver.Session(neo4j.AccessModeWrite)
	if err != nil {
		fmt.Printf("%s", err)
		return nil
	}
	return Instance
}
