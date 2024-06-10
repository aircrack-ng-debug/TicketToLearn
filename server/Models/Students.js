const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    course: { type: String, required: true } // Einfacher String für Kursname
});

const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;
