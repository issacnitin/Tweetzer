package tweet

type Tweet struct {
	Username  string `json:"username" bson:"username"`
	Content   string `json:"content" bson:"content"`
	Timestamp int64  `json:"timestamp" bson:"timestamp"`
}
