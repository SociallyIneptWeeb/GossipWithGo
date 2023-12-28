package main

import (
	"backend/database"
	"backend/routes"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	database.ConnectDb()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     os.Getenv("FRONTEND_URL"),
	}))

	routes.SetupRoutes(app)
	app.Listen(":" + os.Getenv("BACKEND_PORT"))
}
