package social

type FollowModal struct {
	profileid string `json:"profileid"`
}

type DatabaseModal struct {
	profileId  string   `json:"profileId"`
	followedby []string `json:"followedby"`
	following  []string `json:"following"`
}
