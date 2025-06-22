document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle
    document.getElementById('sidebarCollapse').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });

    // Hitung Kelayakan Button
    document.getElementById('hitungBtn').addEventListener('click', function() {
        // Validasi form
        const form = document.getElementById('penerimaForm');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        // Simulasi perhitungan kelayakan (persentase random untuk demo)
        // Di implementasi nyata, ini akan memanggil endpoint backend Anda
        const kelayakan = Math.floor(Math.random() * 100);
        let status = '';
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

        // Tampilkan hasil dengan SweetAlert
        Swal.fire({
            title: 'Hasil Perhitungan Kelayakan',
            html: `
                <div class="text-center">
                    <div class="mb-3" style="font-size: 3rem; color: ${icon === 'success' ? '#28a745' : icon === 'warning' ? '#ffc107' : '#dc3545'}">
                        ${kelayakan}%
                    </div>
                    <div class="alert alert-${icon}" role="alert">
                        Status: <strong>${status}</strong>
                    </div>
                    <hr>
                    <small class="text-muted">* Hasil berdasarkan analisis 15 parameter kelayakan</small>
                </div>
            `,
            icon: icon,
            confirmButtonText: 'Simpan Data',
            showCancelButton: true,
            cancelButtonText: 'Perbaiki Data',
            confirmButtonColor: '#4682B4'
        }).then((result) => {
            if (result.isConfirmed) {
                // Simpan data (di implementasi nyata akan mengirim ke backend)
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Data penerima telah disimpan',
                    icon: 'success',
                    confirmButtonColor: '#4682B4'
                }).then(() => {
                    form.reset();
                    form.classList.remove('was-validated');
                });
            }
        });
    });
});

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

// Jalankan setelah DOM siap
document.addEventListener("DOMContentLoaded", tampilkanUsername);
/////////
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle
    document.getElementById('sidebarCollapse').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });

    // Initialize charts
    const distributionCtx = document.getElementById('distributionChart').getContext('2d');
    const statusCtx = document.getElementById('statusChart').getContext('2d');

    // Distribution Chart (Bar Chart)
    const distributionChart = new Chart(distributionCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
            datasets: [
                {
                    label: 'Layak',
                    data: [120, 190, 150, 200, 170, 220, 240, 210, 190, 230, 250, 280],
                    backgroundColor: '#28a745',
                    borderColor: '#28a745',
                    borderWidth: 1
                },
                {
                    label: 'Kurang Layak',
                    data: [50, 60, 70, 80, 90, 100, 90, 80, 70, 60, 50, 40],
                    backgroundColor: '#ffc107',
                    borderColor: '#ffc107',
                    borderWidth: 1
                },
                {
                    label: 'Tidak Layak',
                    data: [30, 40, 35, 45, 40, 35, 30, 25, 20, 15, 10, 5],
                    backgroundColor: '#dc3545',
                    borderColor: '#dc3545',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Status Chart (Doughnut Chart)
    const statusChart = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: ['Layak', 'Kurang Layak', 'Tidak Layak'],
            datasets: [{
                data: [856, 266, 132],
                backgroundColor: [
                    '#28a745',
                    '#ffc107',
                    '#dc3545'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
});

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


