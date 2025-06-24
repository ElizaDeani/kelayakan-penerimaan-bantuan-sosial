// daftar-penerima.js

let semuaData = [];
let currentPage = 1;
const rowsPerPage = 8;

// Fungsi parsing token
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

document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  if (!token) return (window.location.href = "login.html");

  tampilkanUsername();

  const sidebarBtn = document.getElementById('sidebarCollapse');
  if (sidebarBtn) {
    sidebarBtn.addEventListener('click', function () {
      document.getElementById('sidebar').classList.toggle('active');
    });
  }

  // Fetch data dari backend
  fetch("http://localhost:9000/calon", {
    headers: { "Authorization": `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(res => {
      semuaData = res.data.map(d => {
        let status = '';
        if (d.kelayakan >= 70) status = 'Layak';
        else if (d.kelayakan >= 40) status = 'Kurang Layak';
        else status = 'Tidak Layak';
        return { ...d, status };
      });
      tampilkanData();
    })
    .catch(err => {
      console.error(err);
      document.getElementById("tabelPenerima").innerHTML =
        `<tr><td colspan="4">Gagal memuat data</td></tr>`;
    });

  document.getElementById("filterStatus").addEventListener("change", () => {
    currentPage = 1;
    tampilkanData();
  });
});

function tampilkanData() {
  const tbody = document.getElementById("tabelPenerima");
  const filter = document.getElementById("filterStatus").value;

  let dataFiltered = [...semuaData];
  if (filter !== "") {
    dataFiltered = semuaData.filter(d => d.status === filter);
  }

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedData = dataFiltered.slice(start, end);

  tbody.innerHTML = "";
  if (paginatedData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4">Tidak ada data</td></tr>`;
    return;
  }

  paginatedData.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.nama}</td>
      <td>${item.kelayakan.toFixed(0)}%</td>
      <td><span class="badge ${getStatusBadge(item.kelayakan)}">${item.status}</span></td>
      <td>
        <button class="btn btn-info btn-sm me-1" onclick="lihatDetail(${item.id})">
          <i class="fas fa-eye"></i> Detail
        </button>
        <button class="btn btn-warning btn-sm me-1" onclick="editData(${item.id})">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn-danger btn-sm" onclick="hapusData(${item.id})">
          <i class="fas fa-trash-alt"></i> Hapus
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });

  tampilkanPagination(dataFiltered);
}

function tampilkanPagination(data) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(data.length / rowsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === currentPage ? "active" : ""}`;
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener("click", function (e) {
      e.preventDefault();
      currentPage = i;
      tampilkanData();
    });
    pagination.appendChild(li);
  }
}

function getStatusBadge(skor) {
  if (skor >= 70) return "bg-success";
  if (skor >= 40) return "bg-warning text-dark";
  return "bg-danger";
}

function lihatDetail(id) {
  window.location.href = `detail-penerima.html?id=${id}`;
}


function hapusData(id) {
  Swal.fire({
    title: "Hapus Data?",
    text: "Data tidak dapat dikembalikan setelah dihapus.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Ya, hapus!"
  }).then(result => {
    if (result.isConfirmed) {
      const token = localStorage.getItem("token");
      fetch(`http://localhost:9000/calon/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      }).then(() => location.reload());
    }
  });
}

function editData(id) {
  window.location.href = `edit-penerima.html?id=${id}`;
}
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