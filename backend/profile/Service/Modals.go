package profile

type GetUserRequest struct {
	Name    string `json:"name"`
	Phone   string `json:"phone"`
	Country string `json:"country"`
}

type LoginUserRequest struct {
	Username string `json:"username" bson:"username"`
	Password string `json:"password" bson:"password"`
}
