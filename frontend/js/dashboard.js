document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // === SIDEBAR TOGGLE ===
    const sidebarBtn = document.getElementById("sidebarCollapse");
    if (sidebarBtn) {
        sidebarBtn.addEventListener("click", function () {
            document.getElementById("sidebar").classList.toggle("active");
        });
    }

    // === TAMPILKAN USERNAME ===
    tampilkanUsername();

    // === LOGOUT BUTTON ===
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();

            Swal.fire({
                title: "Keluar dari akun?",
                text: "Kamu akan keluar dari sesi saat ini.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Logout",
                cancelButtonText: "Batal",
                confirmButtonColor: "#dc3545",
                cancelButtonColor: "#6c757d"
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem("token");
                    Swal.fire({
                        title: "Berhasil logout!",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = "login.html";
                    });
                }
            });
        });
    }

    // === FETCH DATA UNTUK KARTU & CHART ===
    fetch("http://localhost:9000/calon", {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(res => {
        const data = res.data;

        let total = data.length;
        let layak = 0, kurangLayak = 0, tidakLayak = 0;

        data.forEach(item => {
            const skor = item.kelayakan;
            if (skor >= 70) layak++;
            else if (skor >= 40) kurangLayak++;
            else tidakLayak++;
        });

        // Tampilkan ke Cards
        document.getElementById("totalPenerima").innerText = total;
        document.getElementById("layakCount").innerText = layak;
        document.getElementById("kurangLayakCount").innerText = kurangLayak;
        document.getElementById("tidakLayakCount").innerText = tidakLayak;

        // Render Charts
        renderCharts(data);
    })
    .catch(err => {
        console.error("Gagal fetch data:", err);
    });
});

// === FUNCTION TAMBAHAN ===

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
    if (payload?.username) {
        const el = document.getElementById("usernameDisplay");
        if (el) el.innerText = payload.username;
    }
}

function renderCharts(dataPenerima) {
    const currentMonth = new Date().getMonth(); // 0 = Jan
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const layakData = Array(12).fill(0);
    const kurangLayakData = Array(12).fill(0);
    const tidakLayakData = Array(12).fill(0);

    dataPenerima.forEach(item => {
        if (!item.created_at) return;
        const bulan = new Date(item.created_at).getMonth();
        if (bulan <= currentMonth) {
            const skor = item.kelayakan;
            if (skor >= 70) layakData[bulan]++;
            else if (skor >= 40) kurangLayakData[bulan]++;
            else tidakLayakData[bulan]++;
        }
    });

    const distributionCtx = document.getElementById('distributionChart');
    const statusCtx = document.getElementById('statusChart');
    if (!distributionCtx || !statusCtx) {
        console.warn("Canvas chart tidak ditemukan");
        return;
    }

    // Bar Chart
    new Chart(distributionCtx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Layak',
                    data: layakData,
                    backgroundColor: '#28a745'
                },
                {
                    label: 'Kurang Layak',
                    data: kurangLayakData,
                    backgroundColor: '#ffc107'
                },
                {
                    label: 'Tidak Layak',
                    data: tidakLayakData,
                    backgroundColor: '#dc3545'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // Doughnut Chart
    new Chart(statusCtx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Layak', 'Kurang Layak', 'Tidak Layak'],
            datasets: [{
                data: [
                    layakData.reduce((a,b)=>a+b, 0),
                    kurangLayakData.reduce((a,b)=>a+b, 0),
                    tidakLayakData.reduce((a,b)=>a+b, 0)
                ],
                backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}
