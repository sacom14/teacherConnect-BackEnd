require('dotenv').config(); //para cargar las variables de entorno del archivo .env
const db = require('../config/dbConfig'); //conectar con bd
const bcrypt = require('bcrypt'); //para hasehar el pass
const jwt = require('jsonwebtoken');

const getAllTeachers = async (req, res, next) => {
    try {
        const [teachers, _] = await db.execute('SELECT * FROM teacher');
        res.status(200).json({ teachers });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTeacherById = async (req, res, next) => {
    try {
        //cogemos el parametro de ID
        const id = req.params.id;

        const [teachers, _] = await db.execute('SELECT * FROM teacher WHERE id_teacher = ?', [id]);

        if (teachers.length > 0) {
            res.status(200).json({ teachers });
        } else {
            res.status(200).json({ message: 'Any teacher with this ID' });

        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTeacher = async (req, res, next) => {
    try {
        const idTeacher = req.params.idTeacher; //cogemos el parametro de ID
        const { teacherName, teacherSurname, teacherEmail, teacherPassword, teacherPhone, teacherBirthdate, teacherPhoto } = req.body;
        const hashedPassword = await bcrypt.hash(teacherPassword, 10);

        const query = `
            UPDATE teacher 
            SET teacher_name = ?, 
                teacher_surname = ?, 
                teacher_email = ?, 
                teacher_password = ?, 
                teacher_phone = ?, 
                teacher_birthdate = ?, 
                teacher_photo = ?
            WHERE id_teacher = ?
        `;

        //[result] para ver resultado de consulta de affectdRows
        const [result] = await db.execute(query, [teacherName, teacherSurname, teacherEmail, hashedPassword, teacherPhone, teacherBirthdate, teacherPhoto, idTeacher]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Teacher successfully updated" });
        } else {
            res.status(404).json({ message: "Any teacher with this ID" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addNewTeacher = async (req, res, next) => {
    try {
        // Recuperar los datos del cuerpo de la solicitud
        const { teacherName, teacherSurname, teacherEmail, teacherPassword, teacherPhone, teacherBirthdate, teacherPhoto } = req.body;
        const hashedPassword = await bcrypt.hash(teacherPassword, 10);

        const query = `
        INSERT INTO teacher (teacher_name, teacher_surname, teacher_email, teacher_password, teacher_phone, teacher_birthdate, teacher_photo)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await db.execute(query, [teacherName, teacherSurname, teacherEmail, hashedPassword, teacherPhone, teacherBirthdate, teacherPhoto]);

        res.status(201).json({ message: "Teacher successfully added", teacherId: result[0].insertId });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const teacherLogin = async (req, res, next) => {
    try {
        const { teacher_email, teacher_password } = req.body;

        //revisar el email existente en la BD
        const query = 'SELECT * FROM teacher WHERE teacher_email = ?';
        const [teacher, _] = await db.execute(query, [teacher_email]);

        if (teacher.length > 0) {
            const comparePassword = await bcrypt.compare(teacher_password, teacher[0].teacher_password);
            if (comparePassword) {
                const secretKey = process.env.JWT_SECRET_KEY;
                //emitir el TOKEN
                const token = jwt.sign({ id: teacher[0].id_teacher }, secretKey, { expiresIn: '1h' });
                res.status(200).json({ token, teacherId: teacher[0].id_teacher });
            } else {
                res.status(401).json({ message: "password authentication failed" });
            }
        } else {
            res.status(404).json({ message: "Teacher not found on BD" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const checkRepeatEmail = async (req, res, next) => {
    try {
        const idTeacher = req.params.idTeacher;
        const { teacherEmail } = req.body;
        // Consulta para verificar si existe un email en la tabla 'teacher'
        const query = 'SELECT * FROM teacher WHERE teacher_email = ?';
        const [rows] = await db.query(query, [teacherEmail]);
        
        if (rows.length > 0) {
            const existingTeacherId = rows[0].id_teacher;
            
            if(existingTeacherId === parseInt(idTeacher)){
                res.status(200).json({ message: "This email belongs to the current teacher" });
            } else {
                res.status(400).json({ message: "Email already exists" });
            }
        } else {
            res.status(200).json({ message: "Valid email" });
        }
    } catch (error) {
        // Manejo de errores generales
        res.status(500).json({ error: error.message });
    }
}

const deleteTeacherById = async (req, res, next) => {
    try {
        const idTeacher = req.params.idTeacher;

        const deleteSessionsQuery = `
            DELETE FROM session 
            WHERE fk_id_student_subject IN (
                SELECT id_student_subject 
                FROM student_subject 
                WHERE fk_id_student IN (
                    SELECT id_student 
                    FROM student 
                    WHERE fk_id_teacher = ?
                )
            )
        `;
        await db.execute(deleteSessionsQuery, [idTeacher]);

        const deleteStudentSubjectQuery = `
            DELETE FROM student_subject 
            WHERE fk_id_student IN (
                SELECT id_student 
                FROM student 
                WHERE fk_id_teacher = ?
            )
        `;
        await db.execute(deleteStudentSubjectQuery, [idTeacher]);

        const deleteStudentsQuery = `
            DELETE FROM student 
            WHERE fk_id_teacher = ?
        `;
        await db.execute(deleteStudentsQuery, [idTeacher]);

        const deleteTeacherQuery = `
            DELETE FROM teacher 
            WHERE id_teacher = ?
        `;
        const [result] = await db.execute(deleteTeacherQuery, [idTeacher]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Teacher and related students deleted successfully' });
        } else {
            res.status(404).json({ message: 'Teacher not found or already deleted' });
        }
    } catch (error) {
        console.error('Error deleting teacher:', error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = { getAllTeachers, getTeacherById, addNewTeacher, updateTeacher, teacherLogin, checkRepeatEmail, deleteTeacherById };
