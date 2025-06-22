package utils

import (
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

type JWTClaims struct {
	UserID   int    `json:"user_id"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

// Ambil secret key dari .env (fallback ke default jika kosong)
func getJWTSecret() string {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "supersecretkey"
	}
	return secret
}

// Generate token JWT untuk user ID tertentu
func GenerateJWT(userID int, username string) (string, error) {
	claims := JWTClaims{
		UserID:   userID,
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(getJWTSecret()))
}

// Middleware untuk validasi token JWT di setiap request
func JWTMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		authHeader := c.Request().Header.Get("Authorization")
		if authHeader == "" {
			return echo.NewHTTPError(401, "Authorization token is missing")
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == "" {
			return echo.NewHTTPError(401, "Bearer token is missing")
		}

		token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(getJWTSecret()), nil
		})
		if err != nil || !token.Valid {
			return echo.NewHTTPError(401, "Invalid or expired token")
		}

		claims, ok := token.Claims.(*JWTClaims)
		if !ok {
			return echo.NewHTTPError(401, "Invalid token claims")
		}

		// Simpan user_id ke context
		c.Set("user_id", claims.UserID)
		return next(c)
	}
}
