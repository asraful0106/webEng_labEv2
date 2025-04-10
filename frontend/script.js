function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    const re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return re.test(password);
}

function updateSelectedCoursesDisplay() {
    const selectedOptions = Array.from(document.getElementById('completedCourses').selectedOptions);
    const displayDiv = document.getElementById('selectedCourses');
    

    displayDiv.innerHTML = '';

    selectedOptions.forEach(option => {
        const tag = document.createElement('span');
        tag.textContent = option.text;
        displayDiv.appendChild(tag);
    });
}


updateSelectedCoursesDisplay();


document.getElementById('completedCourses').addEventListener('change', updateSelectedCoursesDisplay);

document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();
    

    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    

    if (!validateEmail(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address';
        return;
    }
    

    if (!validatePassword(password)) {
        document.getElementById('passwordError').textContent = 'Password must be at least 8 characters and contain at least one number and one special character';
        return;
    }
    
  
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: email,
        password: password,
        gender: document.getElementById('gender').value,
        completedCourses: Array.from(document.getElementById('completedCourses').selectedOptions)
            .map(option => option.value),
        favoriteCourse: document.getElementById('favoriteCourse').value
    };
    

    fetch('http://localhost:3000/form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        alert('Form Submition Successfull!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Registration failed. Please try again later.');
    });
});
