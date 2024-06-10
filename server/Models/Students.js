const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    course: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    files: [{
        filename: String,
        originalname: String,
        uploadedBy: String
    }]
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
