document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const totalUsersEl = document.querySelector('#totalUsers .stat-value');
    const genderDistributionEl = document.querySelector('#genderDistribution .stat-value');
    const popularCourseEl = document.querySelector('#popularCourse .stat-value');
    const usersTableBody = document.querySelector('#usersTable tbody');
    
    // Chart instances
    let genderChart, coursesChart;
    
    // Fetch and process data
    async function fetchAndProcessData() {
        try {
            const response = await fetch('http://localhost:3000/form');
            if (!response.ok) throw new Error('Network response failed');
            const users = await response.json();
            
            // Update statistics
            updateStatistics(users);
            
            // Render charts
            renderCharts(users);
            
            // Populate table
            populateTable(users);
            
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to load data. Please try again later.');
        }
    }
    
    function updateStatistics(users) {
        // Total users
        totalUsersEl.textContent = users.length;
        
        // Gender distribution
        const genderCounts = users.reduce((acc, user) => {
            acc[user.gender || 'unspecified'] = (acc[user.gender || 'unspecified'] || 0) + 1;
            return acc;
        }, {});
        genderDistributionEl.innerHTML = Object.entries(genderCounts)
            .map(([gender, count]) => `${gender}: ${count}`)
            .join('<br>');
        
        // Popular course
        const courseCounts = users.reduce((acc, user) => {
            if (user.favoriteCourse) {
                acc[user.favoriteCourse] = (acc[user.favoriteCourse] || 0) + 1;
            }
            return acc;
        }, {});
        const popularCourse = Object.entries(courseCounts)
            .sort((a, b) => b[1] - a[1])[0];
        popularCourseEl.textContent = popularCourse 
            ? `${popularCourse[0]} (${popularCourse[1]} users)` 
            : 'No data';
    }
    
    function renderCharts(users) {
        // Gender chart
        const genderCtx = document.getElementById('genderChart').getContext('2d');
        const genderData = getGenderData(users);
        
        if (genderChart) genderChart.destroy();
        genderChart = new Chart(genderCtx, {
            type: 'pie',
            data: {
                labels: genderData.labels,
                datasets: [{
                    data: genderData.values,
                    backgroundColor: [
                        '#3498db',
                        '#e74c3c',
                        '#2ecc71',
                        '#f39c12'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Gender Distribution'
                    }
                }
            }
        });
        
        // Courses chart
        const coursesCtx = document.getElementById('coursesChart').getContext('2d');
        const coursesData = getCoursesData(users);
        
        if (coursesChart) coursesChart.destroy();
        coursesChart = new Chart(coursesCtx, {
            type: 'bar',
            data: {
                labels: coursesData.labels,
                datasets: [{
                    label: 'Number of Users',
                    data: coursesData.values,
                    backgroundColor: '#3498db'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Favorite Courses'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    function getGenderData(users) {
        const counts = users.reduce((acc, user) => {
            acc[user.gender || 'unspecified'] = (acc[user.gender || 'unspecified'] || 0) + 1;
            return acc;
        }, {});
        
        return {
            labels: Object.keys(counts),
            values: Object.values(counts)
        };
    }
    
    function getCoursesData(users) {
        const counts = users.reduce((acc, user) => {
            if (user.favoriteCourse) {
                acc[user.favoriteCourse] = (acc[user.favoriteCourse] || 0) + 1;
            }
            return acc;
        }, {});
        
        return {
            labels: Object.keys(counts),
            values: Object.values(counts)
        };
    }
    
    function populateTable(users) {
        usersTableBody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.gender || 'Not specified'}</td>
                <td>${user.completedCourses?.join(', ') || 'None'}</td>
                <td>${user.favoriteCourse || 'Not specified'}</td>
            `;
            usersTableBody.appendChild(row);
        });
    }
    
    // Initial load
    fetchAndProcessData();
});
