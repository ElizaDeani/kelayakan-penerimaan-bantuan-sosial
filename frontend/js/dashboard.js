document.addEventListener("DOMContentLoaded", function () {
    // Sidebar toggle
    const sidebarBtn = document.getElementById("sidebarCollapse");
    if (sidebarBtn) {
        sidebarBtn.addEventListener("click", function () {
            document.getElementById("sidebar").classList.toggle("active");
        });
    }

    // Tampilkan username
    tampilkanUsername();

    // Logout button
   document.getElementById("logoutBtn").addEventListener("click", function (e) {
    e.preventDefault();
    console.log("Logout clicked!");

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


    // Cek token: redirect ke login kalau tidak ada token
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
    }
});

// Helper untuk parse token
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

// Tampilkan username di navbar
function tampilkanUsername() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = parseJwt(token);
    if (payload && payload.username) {
        const el = document.getElementById("usernameDisplay");
        if (el) el.innerText = payload.username;
    }
}


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



