package handler

import (
	"net/http"

	"github.com/ElizaDeani/kelayakan-penerimaan-bantuan-sosial/database"
	"github.com/ElizaDeani/kelayakan-penerimaan-bantuan-sosial/model"
	"github.com/ElizaDeani/kelayakan-penerimaan-bantuan-sosial/utils"
	"github.com/golang-jwt/jwt/v4"
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
	token, err := utils.GenerateJWT(user.ID, user.Username)
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

func UpdateUser(c echo.Context) error {
	user := model.User{} // Pastikan kamu punya model User

	// Ambil user dari token
	token := c.Get("user").(*jwt.Token)
	claims := token.Claims.(jwt.MapClaims)
	username := claims["username"].(string)

	// Cari user yang login
	var existingUser model.User
	if err := database.DB.Where("username = ?", username).First(&existingUser).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{"message": "User tidak ditemukan"})
	}

	// Bind input baru
	if err := c.Bind(&user); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{"message": "Data tidak valid"})
	}

	// Hash password baru
	hashed, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	existingUser.Username = user.Username
	existingUser.Password = string(hashed)

	// Simpan perubahan
	if err := database.DB.Save(&existingUser).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"message": "Gagal update user"})
	}

	return c.JSON(http.StatusOK, echo.Map{"message": "Berhasil update username dan password"})
}

func ResetCalon(c echo.Context) error {
	if err := database.DB.Exec("DELETE FROM calon_penerima").Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{"message": "Gagal reset data"})
	}
	return c.JSON(http.StatusOK, echo.Map{"message": "Semua data berhasil dihapus"})
}
