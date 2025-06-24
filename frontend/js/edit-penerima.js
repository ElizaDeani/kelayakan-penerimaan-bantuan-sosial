// js/edit-penerima.js
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("editForm");
  const token = localStorage.getItem("token");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!token || !id) {
    window.location.href = "login.html";
    return;
  }

  // Ambil data berdasarkan ID
  fetch(`http://localhost:9000/calon/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(res => {
      const data = res.data;
      document.getElementById("nama").value = data.nama;
      document.getElementById("usia").value = data.usia;
      document.getElementById('pekerjaan').value = data.pekerjaan;
      document.getElementById('penghasilan').value = data.penghasilan_bulanan;
      document.getElementById('pengeluaran').value = data.pengeluaran_bulanan;
      document.getElementById('tanggungan').value = data.jumlah_tanggungan;
      document.getElementById('anak_sekolah').value = data.jumlah_anak_sekolah;
      document.getElementById('status_kawin').value = data.status_perkawinan
      document.getElementById('pendidikan').value = data.pendidikan_terakhir;
      document.getElementById('kendaraan').value = data.kepemilikan_kendaraan;
      document.getElementById('tempat_tinggal').value = data.kepemilikan_tempat_tinggal;
      document.getElementById('aset_lain').value = data.kepemilikan_aset_lain;
      document.getElementById('akses').value = data.akses_listrik_air;
      document.getElementById('bantuan_lain').value = data.penerima_bantuan_lain;
      
    })
    .catch(() => {
      Swal.fire("Error", "Gagal mengambil data penerima.", "error");
    });

  // Submit perubahan
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const updatedData = {
      nama: document.getElementById("nama").value,
      usia: parseInt(document.getElementById("usia").value),
      // Tambahkan field lain sesuai input
    };

    fetch(`http://localhost:9000/calon/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(updatedData)
    })
      .then(res => res.json())
      .then(() => {
        Swal.fire("Berhasil", "Data berhasil diperbarui!", "success").then(() => {
          window.location.href = "daftar-penerima.html";
        });
      })
      .catch(() => {
        Swal.fire("Gagal", "Terjadi kesalahan saat memperbarui data.", "error");
      });
  });
});
