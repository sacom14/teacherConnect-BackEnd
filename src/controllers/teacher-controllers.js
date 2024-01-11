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
        const id = req.params.id; //cogemos el parametro de ID
        const { teacherName, teacherSurname, teacherEmail, teacherPassword, teacherPhone, teacherBirthdate, teacherPhoto } = req.body;
        const hashedPassword = await bcrypt.hash(teacher_password, 10);

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
        const [result] = await db.execute(query, [teacherName, teacherSurname, teacherEmail, teacherPassword, teacherPhone, teacherBirthdate, teacherPhoto, id]);

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
        const { teacherEmail } = req.body;
        console.log(teacherEmail);
        // Consulta para verificar si existe un email en la tabla 'teacher'
        const query = 'SELECT * FROM teacher WHERE teacher_email = ?';
        const [rows] = await db.query(query, [teacherEmail]);
        console.log(rows)

        if (rows.length > 0) {
            // Si hay resultados, significa que el email ya existe
            res.status(409).json({ message: "Email already exists" });
        } else {
            res.status(200).json({ message: "Email unique" });
        }
    } catch (error) {
        // Manejo de errores generales
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getAllTeachers, getTeacherById, addNewTeacher, updateTeacher, teacherLogin, checkRepeatEmail };
