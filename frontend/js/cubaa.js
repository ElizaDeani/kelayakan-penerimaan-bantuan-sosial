document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  if (!token) return (window.location.href = "login.html");

  fetch("http://localhost:9000/calon", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("tabelPenerima");
      tbody.innerHTML = "";

      data.data.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${item.nama}</td>
          <td>${item.kelayakan.toFixed(0)}%</td>
          <td>
            <span class="badge ${getStatusBadge(item.kelayakan)}">
              ${klasifikasi(item.kelayakan)}
            </span>
          </td>
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
    });

  function getStatusBadge(skor) {
    if (skor >= 70) return "bg-success";
    if (skor >= 40) return "bg-warning text-dark";
    return "bg-danger";
  }

  function klasifikasi(skor) {
    if (skor >= 70) return "Layak";
    if (skor >= 40) return "Kurang Layak";
    return "Tidak Layak";
  }
});

function lihatDetail(id) {
  const token = localStorage.getItem("token");
  fetch(`http://localhost:9000/calon/${id}`, {
    headers: { "Authorization": `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(res => {
      const data = res.data;
      let detailHTML = "<ul class='text-start'>";
      for (const key in data) {
        detailHTML += `<li><strong>${key}</strong>: ${data[key]}</li>`;
      }
      detailHTML += "</ul>";

      Swal.fire({
        title: "Detail Penerima",
        html: detailHTML,
        icon: "info",
        confirmButtonColor: "#4682B4"
      });
    });
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
      })
        .then(() => location.reload());
    }
  });
}

function editData(id) {
  // Arahkan ke halaman edit, bisa disesuaikan
  window.location.href = `edit-penerima.html?id=${id}`;
}

document.addEventListener('DOMContentLoaded', function () {
    const sidebarBtn = document.getElementById('sidebarCollapse');
    if (sidebarBtn) {
        sidebarBtn.addEventListener('click', function () {
            document.getElementById('sidebar').classList.toggle('active');
        });
    }
});
let semuaData = [];
let currentPage = 1;
const rowsPerPage = 5;

function tampilkanData(data) {
  const tabelBody = document.getElementById("tabelPenerima");
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedData = data.slice(start, end);

  tabelBody.innerHTML = "";

  if (paginatedData.length === 0) {
    tabelBody.innerHTML = `<tr><td colspan="4">Tidak ada data</td></tr>`;
    return;
  }

  paginatedData.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.nama}</td>
      <td>${item.kelayakan.toFixed(2)}%</td>
      <td>${item.status}</td>
      <td>
        <button class="btn btn-sm btn-info me-2">Detail</button>
        <button class="btn btn-sm btn-warning me-2">Edit</button>
        <button class="btn btn-sm btn-danger">Hapus</button>
      </td>
    `;
    tabelBody.appendChild(tr);
  });

document.addEventListener("DOMContentLoaded", function () {
  const tabelBody = document.getElementById("tabelPenerima");
  const filterStatus = document.getElementById("filterStatus");

  let semuaData = []; // untuk menyimpan data asli

  function tampilkanData(data) {
    tabelBody.innerHTML = "";

    if (data.length === 0) {
      tabelBody.innerHTML = `<tr><td colspan="4">Tidak ada data</td></tr>`;
      return;
    }

    data.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.nama}</td>
        <td>${item.kelayakan.toFixed(2)}%</td>
        <td>${item.status}</td>
        <td>
          <button class="btn btn-sm btn-info me-2">Detail</button>
          <button class="btn btn-sm btn-warning me-2">Edit</button>
          <button class="btn btn-sm btn-danger">Hapus</button>
        </td>
      `;
      tabelBody.appendChild(tr);
    });
  }

  function filterData() {
    const selected = filterStatus.value;
    if (selected === "") {
      tampilkanData(semuaData);
    } else {
      const hasilFilter = semuaData.filter((d) => d.status === selected);
      tampilkanData(hasilFilter);
    }
  }

  // Fetch Data
  const token = localStorage.getItem("token");
  fetch("http://localhost:9000/calon", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      semuaData = res.data.map((d) => {
        let status = "";
        if (d.kelayakan >= 70) status = "Layak";
        else if (d.kelayakan >= 40) status = "Kurang Layak";
        else status = "Tidak Layak";

        return { ...d, status };
      });

      tampilkanData(semuaData);
    })
    .catch((err) => {
      console.error(err);
      tabelBody.innerHTML = `<tr><td colspan="4">Gagal memuat data</td></tr>`;
    });

  // Event listener untuk filter
  filterStatus.addEventListener("change", filterData);
});



  tampilkanPagination(data);
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
      filterData(); // Re-render dengan halaman baru
    });
    pagination.appendChild(li);
  }
}

function filterData() {
  const selected = document.getElementById("filterStatus").value;
  let filteredData = semuaData;

  if (selected !== "") {
    filteredData = semuaData.filter((d) => d.status === selected);
  }

  currentPage = 1; // reset halaman jika filter berubah
  tampilkanData(filteredData);
}

// Fetch Data dari Backend
const token = localStorage.getItem("token");
fetch("http://localhost:9000/calon", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => res.json())
  .then((res) => {
    semuaData = res.data.map((d) => {
      let status = "";
      if (d.kelayakan >= 70) status = "Layak";
      else if (d.kelayakan >= 40) status = "Kurang Layak";
      else status = "Tidak Layak";

      return { ...d, status };
    });

    tampilkanData(semuaData);
  })
  .catch((err) => {
    console.error(err);
    document.getElementById("tabelPenerima").innerHTML =
      `<tr><td colspan="4">Gagal memuat data</td></tr>`;
  });

// Event listener filter
document.getElementById("filterStatus").addEventListener("change", filterData);

