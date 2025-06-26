package model

import "time"

func (CalonPenerima) TableName() string {
	return "calon_penerima"
}

type CalonPenerima struct {
	ID                       int       `json:"id" gorm:"primaryKey;autoIncrement"`
	Nama                     string    `json:"nama"`
	Usia                     int       `json:"usia"`
	Pekerjaan                string    `json:"pekerjaan"`
	PenghasilanBulanan       int       `json:"penghasilan_bulanan"`
	PengeluaranBulanan       int       `json:"pengeluaran_bulanan"`
	JumlahTanggungan         int       `json:"jumlah_tanggungan"`
	JumlahAnakSekolah        int       `json:"jumlah_anak_sekolah"`
	StatusPerkawinan         string    `json:"status_perkawinan"`          // Menikah, Belum Menikah, Cerai
	PendidikanTerakhir       string    `json:"pendidikan_terakhir"`        // SD, SMP, SMA, S1
	KepemilikanKendaraan     string    `json:"kepemilikan_kendaraan"`      // Tidak Ada, Motor, Mobil
	KepemilikanTempatTinggal string    `json:"kepemilikan_tempat_tinggal"` // Milik Sendiri, Kontrak, Menumpang
	KepemilikanAsetLain      bool      `json:"kepemilikan_aset_lain"`
	AksesListrikAir          string    `json:"akses_listrik_air"` // Tidak Ada, Salah Satu, Lengkap
	PenerimaBantuanLain      bool      `json:"penerima_bantuan_lain"`
	Kelayakan                float64   `json:"kelayakan"`
	CreatedAt                time.Time `json:"created_at"`
}
