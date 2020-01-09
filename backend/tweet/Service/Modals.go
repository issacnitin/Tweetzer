package tweet

type Tweet struct {
	Content   string `json:"content"`
	Timestamp int64  `json:"timestamp"`
}
