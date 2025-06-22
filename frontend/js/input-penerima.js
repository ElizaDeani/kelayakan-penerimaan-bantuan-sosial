document.addEventListener('DOMContentLoaded', function () {
    // Toggle sidebar
    document.getElementById('sidebarCollapse').addEventListener('click', function () {
        document.getElementById('sidebar').classList.toggle('active');
    });

    const form = document.getElementById('penerimaForm');
    const hitungBtn = document.getElementById('hitungBtn');
    const simpanBtn = document.getElementById('simpanBtn');

    let kelayakan = 0;
    let status = '';

    // Tombol Hitung Kelayakan
    hitungBtn.addEventListener('click', function () {
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const token = localStorage.getItem("token");

        // Ambil data dari form
        const data = {
            nama: document.getElementById('nama').value,
            usia: parseInt(document.getElementById('usia').value),
            pekerjaan: document.getElementById('pekerjaan').value,
            penghasilan_bulanan: parseInt(document.getElementById('penghasilan').value),
            pengeluaran_bulanan: parseInt(document.getElementById('pengeluaran').value),
            jumlah_tanggungan: parseInt(document.getElementById('tanggungan').value),
            jumlah_anak_sekolah: parseInt(document.getElementById('anak_sekolah').value),
            status_perkawinan: document.getElementById('status_kawin').value,
            pendidikan_terakhir: document.getElementById('pendidikan').value,
            kepemilikan_kendaraan: document.getElementById('kendaraan').value,
            kepemilikan_tempat_tinggal: document.getElementById('tempat_tinggal').value,
            kepemilikan_aset_lain: document.getElementById('aset_lain').value === 'true',
            akses_listrik_air: document.getElementById('akses').value,
            penerima_bantuan_lain: document.getElementById('bantuan_lain').value === 'Ada'
        };

        // Kirim ke backend
        fetch("http://localhost:9000/calon/preview", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(res => {
                const kelayakanObj = res.kelayakan;
	if (!kelayakanObj || typeof kelayakanObj.skor !== "number") {
		throw new Error("Nilai kelayakan tidak valid dari server");
	}

	kelayakan = kelayakanObj.skor;
	status = kelayakanObj.klasifikasi;
                let icon = '';

                if (kelayakan >= 70) {
                    status = 'Layak';
                    icon = 'success';
                } else if (kelayakan >= 40) {
                    status = 'Kurang Layak';
                    icon = 'warning';
                } else {
                    status = 'Tidak Layak';
                    icon = 'error';
                }
                if (isNaN(kelayakan)) {
                     throw new Error("Nilai kelayakan tidak valid dari server");
                }


                Swal.fire({
                    title: 'Hasil Perhitungan Kelayakan',
                    html: `
                        <div class="text-center">
                            <div class="mb-3" style="font-size: 3rem; color: ${icon === 'success' ? '#28a745' : icon === 'warning' ? '#ffc107' : '#dc3545'}">
                                ${Math.round(kelayakan)}%
                            </div>
                            <div class="alert alert-${icon}" role="alert">
                                Status: <strong>${status}</strong>
                            </div>
                            <hr>
                            <small class="text-muted">* Berdasarkan 15 parameter kelayakan</small>
                        </div>
                    `,
                    icon: icon,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#4682B4'
                });

                // ✅ Aktifkan tombol simpan jika ingin pisah penyimpanan
                simpanBtn.disabled = false;

                // Simpan nilai ke localStorage (opsional)
                localStorage.setItem("kelayakanTerakhir", kelayakan);
            })
            .catch(err => {
                console.error(err);
                Swal.fire("Gagal!", "Gagal hitung kelayakan dari server.", "error");
            });
    });

    // Tombol Simpan Data (kalau endpointnya dipisah nanti)
    simpanBtn.addEventListener('click', function () {
        const token = localStorage.getItem("token");

    const data = {
        nama: document.getElementById('nama').value,
        usia: parseInt(document.getElementById('usia').value),
        pekerjaan: document.getElementById('pekerjaan').value,
        penghasilan_bulanan: parseInt(document.getElementById('penghasilan').value),
        pengeluaran_bulanan: parseInt(document.getElementById('pengeluaran').value),
        jumlah_tanggungan: parseInt(document.getElementById('tanggungan').value),
        jumlah_anak_sekolah: parseInt(document.getElementById('anak_sekolah').value),
        status_perkawinan: document.getElementById('status_kawin').value,
        pendidikan_terakhir: document.getElementById('pendidikan').value,
        kepemilikan_kendaraan: document.getElementById('kendaraan').value,
        kepemilikan_tempat_tinggal: document.getElementById('tempat_tinggal').value,
        kepemilikan_aset_lain: document.getElementById('aset_lain').value === 'true',
        akses_listrik_air: document.getElementById('akses').value,
        penerima_bantuan_lain: document.getElementById('bantuan_lain').value === 'Ada',
        kelayakan: parseFloat(localStorage.getItem("kelayakanTerakhir")) || 0
    };

    fetch("http://localhost:9000/calon", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
        Swal.fire({
            title: 'Berhasil!',
            text: 'Data penerima berhasil disimpan ke server.',
            icon: 'success',
            confirmButtonColor: '#4682B4'
        });
        form.reset();
        form.classList.remove('was-validated');
        simpanBtn.disabled = true;
        localStorage.removeItem("kelayakanTerakhir");
    })
    .catch(err => {
        console.error(err);
        Swal.fire("Gagal!", "Terjadi kesalahan saat menyimpan data.", "error");
    });
});

    tampilkanUsername(); // ← Harus dipanggil setelah fungsi ini didefinisikan
});

// Fungsi parsing dan menampilkan username
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = decodeURIComponent(atob(base64Url).split('').map(c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
        return JSON.parse(base64);
    } catch (e) {
        return null;
    }
}

function tampilkanUsername() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = parseJwt(token);
    if (payload && payload.username) {
        const el = document.getElementById("usernameDisplay");
        if (el) el.innerText = payload.username;
    }
}
