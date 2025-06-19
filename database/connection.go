package database

import (
	"fmt"
	"log"
	"os"

	"github.com/ElizaDeani/kelayakan-penerimaan-bantuan-sosial/model"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Gagal load file .env")
	}

	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASSWORD")
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	name := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", user, pass, host, port, name)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Gagal koneksi ke database:", err)
	}
	DB = db

	// Auto migrate tabel
	db.AutoMigrate(&model.User{}, &model.CalonPenerima{})

	fmt.Println("Database connected & migrated")

}
