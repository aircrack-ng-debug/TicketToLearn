const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const StudentModel = require('./Models/Students.js');

// Define jwt for my page
// lade Umgebungsvariablen
require('dotenv').config();
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;


const app = express(); // Define app before using it
app.use(express.json());
app.use(cors());

const mongoUri = 'mongodb+srv://mauricemundi:MauriceMundi@cluster0.jsrkzzp.mongodb.net/yourDatabaseName?retryWrites=true&w=majority';

mongoose.connect(mongoUri)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Register endpoint
app.post('/register', async (req, res) => {
    try {
        const { name, email, password, course } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new StudentModel({ name, email, password: hashedPassword, course });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await StudentModel.findOne({ email });
        if (!user) {
            console.log('No record existed for email:', email);
            return res.status(401).json("No record existed");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for user:', email);
            return res.status(401).json("The password is incorrect");
        }

        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ token });  // Return the token here

    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            req.user = decoded;
            next();
        });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

// MyPage endpoint
app.get('/my-page', authenticateJWT, async (req, res) => {
    try {
        const user = await StudentModel.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ name: user.name, email: user.email, course: user.course });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


