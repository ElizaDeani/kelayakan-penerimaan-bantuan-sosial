package handler

import (
	"net/http"

	"github.com/ElizaDeani/kelayakan-penerimaan-bantuan-sosial/database"
	"github.com/ElizaDeani/kelayakan-penerimaan-bantuan-sosial/model"
	"github.com/ElizaDeani/kelayakan-penerimaan-bantuan-sosial/utils"
	_ "github.com/golang-jwt/jwt/v4"
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
	userIDInterface := c.Get("user_id")
	userID, ok := userIDInterface.(int) // sudah cukup
	if !ok {
		return echo.NewHTTPError(http.StatusUnauthorized, "User ID tidak valid")
	}

	var input struct {
		Username     string `json:"username"`
		PasswordBaru string `json:"password_baru"`
	}

	if err := c.Bind(&input); err != nil {
		return c.JSON(http.StatusBadRequest, echo.Map{
			"message": "Gagal parsing request",
			"error":   err.Error(),
		})
	}

	updateData := map[string]interface{}{}
	if input.Username != "" {
		updateData["username"] = input.Username
	}
	if input.PasswordBaru != "" {
		hashed, _ := bcrypt.GenerateFromPassword([]byte(input.PasswordBaru), bcrypt.DefaultCost)
		updateData["password"] = string(hashed)
	}

	if err := database.DB.Model(&model.User{}).
		Where("id = ?", userID).
		Updates(updateData).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{
			"message": "Gagal update data",
			"error":   err.Error(),
		})
	}

	return c.JSON(http.StatusOK, echo.Map{
		"message": "Data user berhasil diperbarui",
	})
}

func DeleteUser(c echo.Context) error {
	userIDInterface := c.Get("user_id")
	userID, ok := userIDInterface.(int)
	if !ok {
		return echo.NewHTTPError(http.StatusUnauthorized, "User ID tidak valid")
	}

	// Cek apakah user ada
	var user model.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		return c.JSON(http.StatusNotFound, echo.Map{
			"message": "User tidak ditemukan",
			"error":   err.Error(),
		})
	}

	// Hapus akun user
	if err := database.DB.Delete(&user).Error; err != nil {
		return c.JSON(http.StatusInternalServerError, echo.Map{
			"message": "Gagal menghapus user",
			"error":   err.Error(),
		})
	}

	return c.JSON(http.StatusOK, echo.Map{
		"message": "Akun berhasil dihapus",
	})
}
