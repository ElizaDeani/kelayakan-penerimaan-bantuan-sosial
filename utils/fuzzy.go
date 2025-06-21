package utils

import (
	"strings"

	"github.com/ElizaDeani/kelayakan-penerimaan-bantuan-sosial/model"
)

type FuzzyResult struct {
	Skor        float64 `json:"skor"`
	Klasifikasi string  `json:"klasifikasi"`
}

func HitungFuzzyTsukamoto(c model.CalonPenerima) FuzzyResult {
	var skor float64

	// Penghasilan: makin rendah makin layak (maks 30)
	if c.PenghasilanBulanan <= 1000000 {
		skor += 30
	} else if c.PenghasilanBulanan <= 2000000 {
		skor += 20
	} else if c.PenghasilanBulanan <= 3000000 {
		skor += 10
	}

	// Pengeluaran: makin besar makin layak (maks 20)
	if c.PengeluaranBulanan >= 2000000 {
		skor += 20
	} else if c.PengeluaranBulanan >= 1500000 {
		skor += 15
	} else if c.PengeluaranBulanan >= 1000000 {
		skor += 10
	}

	// Jumlah tanggungan: makin banyak makin layak (maks 15)
	if c.JumlahTanggungan >= 5 {
		skor += 15
	} else if c.JumlahTanggungan >= 3 {
		skor += 10
	} else if c.JumlahTanggungan >= 1 {
		skor += 5
	}

	// Jumlah anak sekolah: makin banyak makin layak (maks 15)
	if c.JumlahAnakSekolah >= 3 {
		skor += 15
	} else if c.JumlahAnakSekolah >= 2 {
		skor += 10
	} else if c.JumlahAnakSekolah >= 1 {
		skor += 5
	}

	// Usia: makin tua makin layak (maks 10)
	if c.Usia >= 60 {
		skor += 10
	} else if c.Usia >= 50 {
		skor += 5
	}

	// Tempat tinggal: menumpang atau kontrak lebih layak (maks 10)
	switch strings.ToLower(c.KepemilikanTempatTinggal) {
	case "menumpang":
		skor += 10
	case "kontrak":
		skor += 7
	case "milik sendiri":
		skor += 2
	}

	// Klasifikasi
	var klasifikasi string
	switch {
	case skor >= 70:
		klasifikasi = "Layak"
	case skor >= 40:
		klasifikasi = "Kurang Layak"
	default:
		klasifikasi = "Tidak Layak"
	}

	return FuzzyResult{
		Skor:        skor,
		Klasifikasi: klasifikasi,
	}
}
