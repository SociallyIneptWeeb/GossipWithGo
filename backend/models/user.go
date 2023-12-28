package models

type User struct {
	Base
	Username string `json:"username" gorm:"unique"`
	Password []byte `json:"-"` // hide password from JSON
}
