document.addEventListener('DOMContentLoaded', function() {
    const usersContainer = document.getElementById('usersContainer');
    const refreshBtn = document.getElementById('refreshBtn');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const sortSelect = document.getElementById('sortSelect');
    const loadingIndicator = document.getElementById('loadingIndicator');

    let allUsers = [];
    
    function showLoading(show) {
        loadingIndicator.style.display = show ? 'block' : 'none';
    }

    function filterAndSortUsers(users, searchTerm, sortBy) {
        // Filter
        let filtered = searchTerm 
            ? users.filter(user => 
                user.firstName.toLowerCase().includes(searchTerm) ||
                user.lastName.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm))
            : [...users];
        
        // Sort
        switch(sortBy) {
            case 'firstName':
                filtered.sort((a, b) => a.firstName.localeCompare(b.firstName));
                break;
            case 'firstNameDesc':
                filtered.sort((a, b) => b.firstName.localeCompare(a.firstName));
                break;
            case 'lastName':
                filtered.sort((a, b) => a.lastName.localeCompare(b.lastName));
                break;
            case 'lastNameDesc':
                filtered.sort((a, b) => b.lastName.localeCompare(a.lastName));
                break;
            case 'email':
                filtered.sort((a, b) => a.email.localeCompare(b.email));
                break;
        }
        
        return filtered;
    }

    function fetchUsers() {
        showLoading(true);
        fetch('http://localhost:3000/form')
            .then(response => {
                if (!response.ok) throw new Error('Network response failed');
                return response.json();
            })
            .then(users => {
                allUsers = users;
                renderUsers();
            })
            .catch(error => {
                console.error('Error:', error);
                usersContainer.innerHTML = '<p class="error">Error loading data. Please try again.</p>';
            })
            .finally(() => showLoading(false));
    }

    function renderUsers() {
        const searchTerm = searchInput.value.toLowerCase();
        const sortBy = sortSelect.value;
        
        const filteredUsers = filterAndSortUsers(allUsers, searchTerm, sortBy);
        
        usersContainer.innerHTML = '';
        if (filteredUsers.length === 0) {
            usersContainer.innerHTML = '<p>No matching users found</p>';
            return;
        }

        filteredUsers.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            userCard.innerHTML = `
                <h3>${user.firstName} ${user.lastName}</h3>
                <div class="user-field"><strong>Email:</strong> ${user.email}</div>
                <div class="user-field"><strong>Gender:</strong> ${user.gender || 'Not specified'}</div>
                <div class="user-field">
                    <strong>Completed Courses:</strong> 
                    ${user.completedCourses?.join(', ') || 'None'}
                </div>
                <div class="user-field">
                    <strong>Favorite Course:</strong> 
                    ${user.favoriteCourse || 'Not specified'}
                </div>
            `;
            usersContainer.appendChild(userCard);
        });
    }

    // Initial load
    fetchUsers();

    // Event listeners
    refreshBtn.addEventListener('click', fetchUsers);
    searchBtn.addEventListener('click', renderUsers);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') renderUsers();
    });
    sortSelect.addEventListener('change', renderUsers);
});
