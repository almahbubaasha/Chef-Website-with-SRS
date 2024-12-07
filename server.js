const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 4000;

app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Middleware to parse JSON bodies

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Your database password
    database: 'myservserr'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database.');
});

// API endpoint to fetch users
app.get('/api/users', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).json({ error: 'Database query failed' });
            return;
        }
        res.json(results);
    });
});

// Add data
app.post('/api/users', (req, res) => {
    const user = req.body; // Parsed JSON data
    db.query('INSERT INTO users SET ?', user, (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            res.status(500).json({ error: 'Failed to insert user' });
            return;
        }
        res.status(201).json({ message: 'User added successfully', id: result.insertId });
    });
});

// Delete data
app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;

    console.log(`Received request to delete user with ID: ${userId}`); // Debugging log

    // Check if the userId is valid
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    // Execute DELETE query
    db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err); // Log the error
            return res.status(500).json({ error: 'Failed to delete user' });
        }

        // Check if a user was actually deleted
        if (result.affectedRows === 0) {
            console.log(`No user found with ID: ${userId}`);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(`User with ID ${userId} deleted successfully`);
        res.status(200).json({ message: 'User deleted successfully' });
    });
});

// Update data (Corrected)
app.put('/api/users/:id', (req, res) => {
    const { name, email, message } = req.body;
    const userId = req.params.id;
    const query = 'UPDATE users SET name = ?, email = ?, message = ? WHERE id = ?';
    
    db.query(query, [name, email, message, userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error updating user' });
        }
        res.status(200).json({ message: 'User updated successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
