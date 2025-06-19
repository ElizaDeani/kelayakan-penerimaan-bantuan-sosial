package handler

import (
	"log"
	"net/http"

	"github.com/ElizaDeani/kelayakan-penerimaan-bantuan-sosial/database"
	"github.com/ElizaDeani/kelayakan-penerimaan-bantuan-sosial/model"
	"github.com/ElizaDeani/kelayakan-penerimaan-bantuan-sosial/utils"
	"github.com/labstack/echo/v4"
)

// CreateCalon menyimpan data calon & menghitung kelayakan
func CreateCalon(c echo.Context) error {
	var calon model.CalonPenerima

	// Bind request ke struct
	if err := c.Bind(&calon); err != nil {
		log.Println("❌ Error bind data calon:", err)
		return c.JSON(http.StatusBadRequest, echo.Map{
			"message": "Data tidak valid",
			"error":   err.Error(),
		})
	}

	// Hitung kelayakan dengan fuzzy Tsukamoto
	kelayakan := utils.HitungFuzzyTsukamoto(calon)
	calon.Kelayakan = kelayakan

	// Simpan ke database
	if err := database.DB.Create(&calon).Error; err != nil {
		log.Println("❌ Gagal simpan data calon:", err)
		return c.JSON(http.StatusInternalServerError, echo.Map{
			"message": "Gagal menyimpan data",
			"error":   err.Error(),
		})
	}

	return c.JSON(http.StatusCreated, echo.Map{
		"message":   "Data calon berhasil disimpan",
		"kelayakan": kelayakan,
		"data":      calon,
	})
}

// GetAllCalon menampilkan seluruh data calon penerima
func GetAllCalon(c echo.Context) error {
	var calonList []model.CalonPenerima

	if err := database.DB.Find(&calonList).Error; err != nil {
		log.Println("❌ Gagal ambil semua data calon:", err)
		return c.JSON(http.StatusInternalServerError, echo.Map{
			"message": "Gagal mengambil data calon",
			"error":   err.Error(),
		})
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": calonList,
	})
}

// GetCalonByID menampilkan data calon berdasarkan ID
func GetCalonByID(c echo.Context) error {
	id := c.Param("id")
	var calon model.CalonPenerima

	if err := database.DB.First(&calon, id).Error; err != nil {
		log.Println("❌ Data calon tidak ditemukan:", err)
		return c.JSON(http.StatusNotFound, echo.Map{
			"message": "Data tidak ditemukan",
			"error":   err.Error(),
		})
	}

	return c.JSON(http.StatusOK, echo.Map{
		"data": calon,
	})
}
