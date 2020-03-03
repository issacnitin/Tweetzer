package tweet

type Tweet struct {
	Content   string `json:"content" bson:"content"`
	Timestamp int64  `json:"timestamp" bson:"timestamp"`
}

type DatabaseModal struct {
	ProfileId string  `json:"profileId" bson:"profileId"`
	Tweets    []Tweet `json:"tweets" bson:"tweets"`
}
