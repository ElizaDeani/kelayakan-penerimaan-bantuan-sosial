package utils

import (
	"math"

	"github.com/ElizaDeani/kelayakan-penerimaan-bantuan-sosial/model"
)

// HitungFuzzyTsukamoto menghitung nilai kelayakan menggunakan metode Fuzzy Tsukamoto
func HitungFuzzyTsukamoto(c model.CalonPenerima) float64 {
	// Fuzzifikasi input
	// Nilai keanggotaan di semua himpunan fuzzy
	μPenghasilanRendah := derajatRendah(float64(c.PenghasilanBulanan), 0, 1000000)
	μPengeluaranTinggi := derajatTinggi(float64(c.PengeluaranBulanan), 1000000, 3000000)
	μTanggunganBanyak := derajatTinggi(float64(c.JumlahTanggungan), 2, 5)
	μAnakSekolahBanyak := derajatTinggi(float64(c.JumlahAnakSekolah), 1, 3)
	μUsiaTua := derajatTinggi(float64(c.Usia), 50, 65)

	// Aturan (semua AND → min operator)
	// Jika penghasilan rendah DAN pengeluaran tinggi DAN tanggungan banyak DAN anak sekolah banyak DAN usia tua
	// Maka kelayakan tinggi

	// Derajat kebenaran masing-masing aturan
	alpha := math.Min(μPenghasilanRendah,
		math.Min(μPengeluaranTinggi,
			math.Min(μTanggunganBanyak,
				math.Min(μAnakSekolahBanyak, μUsiaTua))))

	// Output Tsukamoto: nilai z dari rule
	// Kita asumsikan z adalah persentase kelayakan (0–100)
	z := alpha * 100

	return math.Round(z*100) / 100 // dibulatkan 2 angka di belakang koma
}

// Fungsi keanggotaan linear turun
func derajatRendah(x, a, b float64) float64 {
	if x <= a {
		return 1
	} else if x >= b {
		return 0
	} else {
		return (b - x) / (b - a)
	}
}

// Fungsi keanggotaan linear naik
func derajatTinggi(x, a, b float64) float64 {
	if x <= a {
		return 0
	} else if x >= b {
		return 1
	} else {
		return (x - a) / (b - a)
	}
}
