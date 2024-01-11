const db = require('../config/dbConfig');

const getAllStudents = async (req, res, next) => {
    try {
        const [students, _] = await db.execute('SELECT * FROM student');
        res.status(200).json({ students });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getStudentsByTeacher = async (req, res, next) => {
    try {
        // teacherID
        const teacherId = req.params.teacherId;

        const query = `
            SELECT *, academic_year_name, payment_method_name FROM student
            INNER JOIN academic_year ON fk_id_academic_year = id_academic_year
            INNER JOIN payment_method ON fk_id_payment_method = id_payment_method
            WHERE fk_id_teacher = ?
        `;

        const [students, _] = await db.execute(query, [teacherId]);

        if (students.length > 0) {
            res.status(200).json({ students });
        } else {
            res.status(200).json({ message: 'Any students for this teacher' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getStudentById = async (req, res, next) => {
    try {
        //cogemos el parametro de ID
        const id = req.params.id;

        const [students, _] = await db.execute(`
            SELECT *, academic_year_name, payment_method_name FROM student
            INNER JOIN academic_year ON fk_id_academic_year = id_academic_year
            INNER JOIN payment_method ON fk_id_payment_method = id_payment_method
            WHERE id_student = ?
        `, [id]);

        if (students.length > 0) {
            res.status(200).json({ students });
        } else {
            res.status(200).json({ message: 'Any student with this ID' });

        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addNewStudent = async (req, res, next) => {
    try {
        //Datos del body de la solicitud
        const {
            studentName,
            studentSurname,
            studentEmail,
            studentBirthdate,
            studentPhone,
            studentPhoto,
            fkIdTeacher,
            fkIdAcademicYear,
            fkIdPaymentMethod
        } = req.body;

        const query = `
            INSERT INTO student (
                student_name,
                student_surname,
                student_email,
                student_birthdate,
                student_phone,
                student_photo,
                fk_id_teacher,
                fk_id_academic_year,
                fk_id_payment_method
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const result = await db.execute(query, [
            studentName,
            studentSurname,
            studentEmail,
            studentBirthdate,
            studentPhone,
            studentPhoto,
            fkIdTeacher,
            fkIdAcademicYear,
            fkIdPaymentMethod
        ]);

        // Enviar respuesta
        res.status(201).json({ message: "Student successfully added", studentId: result[0].insertId });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateStudent = async (req, res, next) => {
    try {
        // Obtener el ID del estudiante de los parámetros de la ruta y los datos a actualizar del cuerpo de la solicitud
        const id = req.params.id;
        const { studentName, studentSurname, studentEmail, studentBirthdate, studentPhone, studentPhoto, fkIdTeacher, fkIdAcademicYear, fkIdPaymentMethod } = req.body;

        // Crear la consulta SQL para actualizar el estudiante
        const query = `
            UPDATE student
            SET student_name = ?, 
                student_surname = ?, 
                student_email = ?, 
                student_birthdate = ?, 
                student_phone = ?, 
                student_photo = ?, 
                fk_id_teacher = ?, 
                fk_id_academic_year = ?, 
                fk_id_payment_method = ?
            WHERE id_student = ?
        `;

        // Ejecutar la consulta y manejar la respuesta
        const [result] = await db.execute(query, [studentName, studentSurname, studentEmail, studentBirthdate, studentPhone, studentPhoto, fkIdTeacher, fkIdAcademicYear, fkIdPaymentMethod, id]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Student successfully updated" });
        } else {
            res.status(404).json({ message: "Any student with this ID" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllStudents, getStudentById, addNewStudent, updateStudent, getStudentsByTeacher };
