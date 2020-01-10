package tweet

type Tweet struct {
	Content   string `json:"content"`
	Timestamp int64  `json:"timestamp"`
}

type DatabaseModal struct {
	ProfileId string  `json:"profileId"`
	Tweets    []Tweet `json:"tweets"`
}
