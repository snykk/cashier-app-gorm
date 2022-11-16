package model

import (
	"time"

	"gorm.io/gorm"
)

type Credential struct {
	Host         string
	Username     string
	Password     string
	DatabaseName string
	Port         int
	Schema       string
}

type Cart struct {
	gorm.Model
	ProductID  uint    `json:"product_id"`
	Quantity   float64 `json:"quantity"`
	TotalPrice float64 `json:"total_price"`
}

type Product struct {
	gorm.Model
	Name     string  `gorm:"type:varchar(100);unique_index"`
	Price    float64 `json:"price"`
	Stock    int     `json:"stock"`
	Discount float64 `json:"discount"`
	Type     string  `json:"type"`
}

type JoinCart struct {
	Id         uint    `json:"id"`
	ProductId  uint    `json:"product_id"`
	Name       string  `json:"name"`
	Quantity   float64 `json:"quantity"`
	TotalPrice float64 `json:"total_price"`
}

type Session struct {
	gorm.Model
	Token    string
	Username string `gorm:"type:varchar(100);unique_index"`
	Expiry   time.Time
}

type User struct {
	gorm.Model
	Password string
	Username string `gorm:"type:varchar(100);unique_index"`
}

type SuccessResponse struct {
	Username string `json:"username"`
	Message  string `json:"message"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}
