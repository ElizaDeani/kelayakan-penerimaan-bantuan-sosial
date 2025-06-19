package main

import (
	"log"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github.com/joho/godotenv"

	"github.com/ElizaDeani/kelayakan-penerimaan-bantuan-sosial/database"
	"github.com/ElizaDeani/kelayakan-penerimaan-bantuan-sosial/routes"
)

func main() {
	// Load .env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Gagal load file .env")
	}

	// Inisialisasi koneksi database
	database.InitDB()

	// Inisialisasi Echo
	e := echo.New()
	e.Use(middleware.Recover())
	routes.InitRoutes(e)

	e.GET("/", func(c echo.Context) error {
		return c.String(200, "Server jalan 🚀")
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "9000" // default
	}
	e.Logger.Fatal(e.Start(":" + port))
}
