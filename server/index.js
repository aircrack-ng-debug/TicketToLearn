const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const StudentModel = require('./Models/Students.js');
const axios = require('axios'); // Add this line

// Load environment variables
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

const app = express();
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

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

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
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

//
app.get('/my-page', authenticateJWT, async (req, res) => {
    try {
        const user = await StudentModel.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            name: user.name,
            email: user.email,
            course: user.course,
            isAdmin: user.isAdmin,
            files: user.files
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// File upload endpoint
app.post('/file-upload', authenticateJWT, upload.single('file'), async (req, res) => {
    try {
        const user = await StudentModel.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Save file info to user (implement logic as needed)
        // Example: user.files.push({ filename: req.file.filename, originalname: req.file.originalname });
        // await user.save();

        res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin file upload endpoint
app.post('/admin-upload', authenticateJWT, upload.single('file'), async (req, res) => {
    try {
        const user = await StudentModel.findById(req.user.userId);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // Find all students in the same course
        const students = await StudentModel.find({ course: user.course });
        const fileInfo = {
            filename: req.file.filename,
            originalname: req.file.originalname,
            uploadedBy: user.name
        };

        // Update each student's files array
        for (let student of students) {
            student.files.push(fileInfo);
            await student.save();
        }

        res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Endpoint to save notes
app.post('/save-notes', authenticateJWT, async (req, res) => {
    try {
        const user = await StudentModel.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { notes } = req.body;
        user.notes = notes;
        await user.save();

        res.status(200).json({ message: 'Notes saved successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to convert text to LaTeX using QuickLaTeX API
app.post('/convert-latex', authenticateJWT, async (req, res) => {
    try {
        const { text } = req.body;
        console.log('Converting text to LaTeX:', text); // Log the input text

        const response = await axios.post('https://www.quicklatex.com/latex3.f', null, {
            params: {
                formula: text,  // Direct LaTeX string
                fsize: 12,
                fcolor: '000000',
                mode: 0,
                out: 1,
                preamble: ''
            }
        });

        console.log('QuickLaTeX API response:', response.data); // Log the response

        // Check if the response indicates an error
        if (response.data.includes('error.png')) {
            console.error('QuickLaTeX API returned an error:', response.data);
            res.status(500).json({ error: 'Error converting text to LaTeX', details: response.data });
        } else {
            res.status(200).json({ imageUrl: response.data });
        }
    } catch (error) {
        console.error('Error converting text to LaTeX:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error converting text to LaTeX', details: error.response ? error.response.data : error.message });
    }
});


