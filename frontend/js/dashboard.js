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