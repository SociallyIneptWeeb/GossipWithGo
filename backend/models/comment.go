package models

type Comment struct {
	Base
	Content  string `json:"content"`
	UserID   uint   `json:"-"`
	User     User   `json:"creator" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	ThreadID uint   `json:"thread_id"`
	Thread   Thread `json:"-" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
}
