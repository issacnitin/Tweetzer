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
}

func GetCollection(collectionName string) *mongo.Collection {
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
	switch collectionName {
	case "profile":
		return Instance.Database("tweetzer").Collection("profile")
	case "tweet":
		return Instance.Database("tweetzer").Collection("tweet")
	case "social":
		return Instance.Database("tweetzer").Collection("social")
	default:
		return nil
	}
}

func createIndexes() {
	mod := mongo.IndexModel{
		Keys: bson.M{
			"content": 1, // index in ascending order
		}, Options: nil,
	}
	ctx, _ := context.WithTimeout(context.Background(), 15*time.Second)
	ind, err := Tweet.Indexes().CreateOne(ctx, mod, nil)
	if err != nil {
		fmt.Println("Error creating index for Tweet collection")
	}

	mod = mongo.IndexModel{
		Keys: bson.M{
			"profileid": 1, // index in ascending order
		}, Options: nil,
	}
	ind, err = Profile.Indexes().CreateOne(ctx, mod, nil)
	if err != nil {
		fmt.Println("Error creating index for Profile collection")
	}
	fmt.Println("CreateOne() index:", ind)
	fmt.Println("CreateOne() type:", reflect.TypeOf(ind), "\n")
}
