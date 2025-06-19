package handler

import (
	"net/http"

	"github.com/ElizaDeani/kelayakan-penerimaan-bantuan-sosial/database"
	"github.com/ElizaDeani/kelayakan-penerimaan-bantuan-sosial/model"
	"github.com/ElizaDeani/kelayakan-penerimaan-bantuan-sosial/utils"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
type RegisterRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func Login(c echo.Context) error {
	var req LoginRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Request tidak valid"})
	}

	var user model.User
	if err := database.DB.Where("username = ?", req.Username).First(&user).Error; err != nil {
		return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Username tidak ditemukan"})
	}

	// Bandingkan password dengan hash
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		return c.JSON(http.StatusUnauthorized, echo.Map{"error": "Password salah"})
	}

	// Generate JWT
	token, err := utils.GenerateJWT(user.ID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal generate token"})
	}

	return c.JSON(http.StatusOK, echo.Map{
		"message": "Login berhasil",
		"token":   token,
	})
}
func Register(c echo.Context) error {
	var req RegisterRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Input tidak valid"})
	}

	// Cek apakah username sudah ada
	var existing model.User
	if err := database.DB.Where("username = ?", req.Username).First(&existing).Error; err == nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"error": "Username sudah digunakan"})
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal hash password"})
	}

	// Simpan user baru
	newUser := model.User{
		Username: req.Username,
		Password: string(hashedPassword),
	}
	if err := database.DB.Create(&newUser).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"error": "Gagal simpan user"})
	}

	return c.JSON(http.StatusOK, echo.Map{
		"message": "Registrasi berhasil",
		"user":    echo.Map{"username": newUser.Username},
	})
}
