document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Sidebar toggle
    const sidebarBtn = document.getElementById("sidebarCollapse");
    if (sidebarBtn) {
        sidebarBtn.addEventListener("click", function () {
            document.getElementById("sidebar").classList.toggle("active");
        });
    }

    // Tampilkan username
    tampilkanUsername();

    // Logout
    const logoutBtn = document.getElementById("logoutBtn");
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

    // Submit form ubah akun
    const form = document.getElementById("formPengaturan");
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const passwordBaru = document.getElementById("passwordBaru").value;

        fetch("http://localhost:9000/pengaturan", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ username, password_baru: passwordBaru })
        })
        .then(res => res.json())
        .then(res => {
            if (res.message?.includes("berhasil")) {
                Swal.fire("Sukses", res.message, "success");
                form.reset();
            } else {
                throw new Error(res.message || "Gagal memperbarui");
            }
        })
        .catch(err => {
            console.error(err);
            Swal.fire("Gagal", "Gagal memperbarui data akun", "error");
        });
    });

    // Hapus akun
    const btnHapus = document.getElementById("hapusAkun");
    btnHapus.addEventListener("click", function () {
        Swal.fire({
            title: "Hapus akun?",
            text: "Akun ini akan dihapus permanen.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Ya, hapus!"
        }).then(result => {
            if (result.isConfirmed) {
                fetch("http://localhost:9000/pengaturan", {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                })
                .then(res => res.json())
                .then(res => {
                    Swal.fire("Dihapus", res.message || "Akun berhasil dihapus", "success")
                    .then(() => {
                        localStorage.removeItem("token");
                        window.location.href = "login.html";
                    });
                })
                .catch(err => {
                    console.error(err);
                    Swal.fire("Gagal", "Gagal menghapus akun", "error");
                });
            }
        });
    });
});

// === UTILS ===
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
