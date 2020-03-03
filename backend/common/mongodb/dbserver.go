package mongodb

import (
	"context"
	"fmt"
	"reflect"
	"time"

	_ "github.com/go-sql-driver/mysql" //Importing mysql connector for golang
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Instance : Singleton Instance
var Instance *mongo.Client
var Profile *mongo.Collection
var Social *mongo.Collection
var Tweet *mongo.Collection

func openDB() {
	fmt.Printf("openDB called")
	Instance, err := mongo.NewClient(options.Client().ApplyURI("mongodb://mongo:27017").SetAuth(options.Credential{
		AuthSource: "admin",
		Username:   "tweetzer",
		Password:   "SomePassword1234",
	}))
	if err != nil {
		fmt.Printf("%s", err.Error())
	}
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = Instance.Connect(ctx)
	if err != nil {
		fmt.Printf("%s", err.Error())
	}
	Profile = Instance.Database("tweetzer").Collection("profile")
	Social = Instance.Database("tweetzer").Collection("social")
	Tweet = Instance.Database("tweetzer").Collection("tweet")
	createIndexes()
}

func init() {
	openDB()
	go healthChecks()
}

func healthChecks() {
	for true {
		if Instance == nil || Profile == nil || Tweet == nil || Social == nil {
			openDB()
		}
		time.Sleep(10 * time.Second)
	}
}

func createIndexes() {
	mod := mongo.IndexModel{
		Keys: bson.M{
			"tweets.content": 1, // index in ascending order
		}, Options: nil,
	}
	ctx, _ := context.WithTimeout(context.Background(), 15*time.Second)
	ind, err := Tweet.Indexes().CreateOne(ctx, mod, nil)
	if err != nil {
		fmt.Println("Error creating index")
		return
	}
	fmt.Println("CreateOne() index:", ind)
	fmt.Println("CreateOne() type:", reflect.TypeOf(ind), "\n")
}
