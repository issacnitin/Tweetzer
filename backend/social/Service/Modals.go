package social

type FollowModal struct {
	username string `json:"username"`
}

type DatabaseModal struct {
	username   string   `json:"username"`
	followedby []string `json:"followedby"`
	following  []string `json:"following"`
}
