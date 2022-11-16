package main

import (
	"a21hc3NpZ25tZW50/api"
	"a21hc3NpZ25tZW50/db"
	"a21hc3NpZ25tZW50/model"
	repo "a21hc3NpZ25tZW50/repository"
)

func main() {
	db := db.NewDB()
	dbCredential := model.Credential{
		Host:         "localhost",
		Username:     "postgres",
		Password:     "12345678",
		DatabaseName: "my_db",
		Port:         5432,
		Schema:       "public",
	}

	conn, err := db.Connect(&dbCredential)
	if err != nil {
		panic(err)
	}

	conn.AutoMigrate(&model.User{}, &model.Session{}, &model.Product{}, &model.Cart{})

	usersRepo := repo.NewUserRepository(conn)
	sessionsRepo := repo.NewSessionsRepository(conn)
	productsRepo := repo.NewProductRepository(conn)
	cartsRepo := repo.NewCartRepository(conn)

	mainAPI := api.NewAPI(usersRepo, sessionsRepo, productsRepo, cartsRepo)
	mainAPI.Start()
}
