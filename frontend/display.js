document.addEventListener('DOMContentLoaded', function() {
    const usersContainer = document.getElementById('usersContainer');
    const refreshBtn = document.getElementById('refreshBtn');

    function fetchUsers() {
        fetch('http://localhost:3000/form')
            .then(response => {
                if (!response.ok) throw new Error('Network response failed');
                return response.json();
            })
            .then(users => {
                usersContainer.innerHTML = '';
                if (users.length === 0) {
                    usersContainer.innerHTML = '<p>No users registered yet</p>';
                    return;
                }

                users.forEach(user => {
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
            })
            .catch(error => {
                console.error('Error:', error);
                usersContainer.innerHTML = '<p class="error">Error loading data. Please try again.</p>';
            });
    }

    // Initial load
    fetchUsers();

    // Refresh button
    refreshBtn.addEventListener('click', fetchUsers);
});
