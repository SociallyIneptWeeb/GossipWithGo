package models

import (
	"time"
)

type Thread struct {
	Base
	Title       string    `json:"title"`
	Description string    `json:"description"`
	CategoryID  uint      `json:"-"`
	Category    Category  `json:"category" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	UserID      uint      `json:"-"`
	User        User      `json:"creator" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	Comments    []Comment `json:"comments" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	EditedAt    time.Time `json:"edited_at" gorm:"default:now()"`
}
