package tweet

type Tweet struct {
	ProfileId string `json:"profileId" bson:"profileId"`
	Content   string `json:"content" bson:"content"`
	Timestamp int64  `json:"timestamp" bson:"timestamp"`
}
