package common

const JWT_SECRET_KEY string = "dasjkhfiuadufasdfasf832742389r923rc325235c7n6235"

type Token struct {
	Token string `json:"Token"`
}

type User struct {
	ProfileId string `json:"profileid"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	Country   string `json:"country"`
	Username  string `json:"username"`
	Password  string `json:"password"`
}

type Error struct {
	Type    int    `json:"type"`
	Message string `json:"message"`
}
