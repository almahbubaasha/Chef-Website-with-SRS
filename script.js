let selectedUser = null;

async function fetchUsers() {
    const response = await fetch('http://localhost:4000/api/users');
    const users = await response.json();
    displayUsers(users);
}

function displayUsers(users) {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    users.forEach(user => {
        userList.innerHTML += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.message}</td>
                <td>
                    <button onclick="editUser(${user.id})">Edit</button>
                    <button onclick="deleteUser(${user.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

async function createUser() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    await fetch('http://localhost:4000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
    });

    clearInputFields();
    fetchUsers();  // Reload users list
}

function clearInputFields() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
}

async function deleteUser(id) {
    try {
        const response = await fetch(`http://localhost:4000/api/users/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const error = await response.json();
            alert(`Error deleting user: ${error.message}`);
            return;
        }

        console.log(`User with ID ${id} deleted successfully`);
        fetchUsers(); // Reload users after deletion
    } catch (err) {
        console.error('Error during delete request:', err);
        alert('Failed to delete user.');
    }
}

function editUser(id) {
    // Fetch the user details by ID
    fetch(`http://localhost:4000/api/users`)
        .then(response => response.json())
        .then(users => {
            // Find the user to edit
            const user = users.find(user => user.id === id);
            if (user) {
                // Populate the form fields with the user's current data
                document.getElementById('name').value = user.name;
                document.getElementById('email').value = user.email;
                document.getElementById('message').value = user.message;

                // Store the selected user for future reference
                selectedUser = user;

                // Show the Update button and set its functionality
                const updateButton = document.getElementById('updateButton');
                updateButton.style.display = 'block';

                // Hide the Add button
                const addButton = document.getElementById('addButton');
                addButton.style.display = 'none';

                // Update user on button click
                updateButton.onclick = function () {
                    updateUser(id);
                };
            } else {
                alert('User not found!');
            }
        })
        .catch(error => {
            console.error('Error fetching user:', error);
            alert('Could not fetch user details.');
        });
}

async function updateUser(id) {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (!name || !email || !message) {
        alert("All fields are required!");
        return;
    }

    await fetch(`http://localhost:4000/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
    });

    clearInputFields();
    fetchUsers(); // Reload users list
    resetForm(); // Reset the form back to Add mode
}

function resetForm() {
    // Hide the Update button and show the Add button again
    const updateButton = document.getElementById('updateButton');
    updateButton.style.display = 'none';

    const addButton = document.getElementById('addButton');
    addButton.style.display = 'block';

    // Clear the selectedUser after update
    selectedUser = null;
}

// Initial fetch of users when the page loads
fetchUsers();
