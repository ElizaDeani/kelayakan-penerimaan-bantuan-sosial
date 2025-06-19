package routes

import (
	"github.com/ElizaDeani/kelayakan-penerimaan-bantuan-sosial/handler"
	"github.com/ElizaDeani/kelayakan-penerimaan-bantuan-sosial/utils"
	"github.com/labstack/echo/v4"
)

// InitRoutes digunakan untuk mendefinisikan semua endpoint
func InitRoutes(e *echo.Echo) {
	// Endpoint tanpa autentikasi
	e.POST("/register", handler.Register)
	e.POST("/login", handler.Login)

	// Grup endpoint yang butuh JWT
	calon := e.Group("/calon")
	calon.Use(utils.JWTMiddleware)

	calon.POST("", handler.CreateCalon)     // tambah calon & hitung kelayakan
	calon.GET("", handler.GetAllCalon)      // semua data calon
	calon.GET("/:id", handler.GetCalonByID) // calon by ID
}
