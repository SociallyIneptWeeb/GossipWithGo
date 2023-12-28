package routes

import (
	"backend/controllers"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	// auth routes
	app.Get("/api/auth/user", controllers.User)
	app.Get("/api/auth/refresh", controllers.Refresh)
	app.Post("/api/auth/register", controllers.Register)
	app.Post("/api/auth/login", controllers.Login)
	app.Post("/api/auth/logout", controllers.Logout)

	// thread routes
	app.Get("/api/threads", controllers.GetThreads)
	app.Get("/api/thread/:id", controllers.GetThread)
	app.Post("/api/thread", controllers.CreateThread)
	app.Delete("/api/thread/:id", controllers.DeleteThread)
	app.Patch("/api/thread/:id", controllers.EditThread)

	// comment routes
	app.Post("/api/comment", controllers.CreateComment)
	app.Delete("/api/comment/:id", controllers.DeleteComment)
	app.Patch("/api/comment/:id", controllers.EditComment)
}
