package repository

import (
	"a21hc3NpZ25tZW50/model"

	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return UserRepository{db}
}

func (u *UserRepository) AddUser(user model.User) error {
	return u.db.Create(&user).Error
}

func (u *UserRepository) UserAvail(cred model.User) error {
	return u.db.Where(&model.User{Username: cred.Username, Password: cred.Password}).First(&model.User{}).Error
}

func (u *UserRepository) CheckPassLength(pass string) bool {
	return len(pass) <= 5
}

func (u *UserRepository) CheckPassAlphabet(pass string) bool {
	for _, charVariable := range pass {
		if (charVariable < 'a' || charVariable > 'z') && (charVariable < 'A' || charVariable > 'Z') {
			return false
		}
	}
	return true
}
