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
            ORDER BY id_student DESC;
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

        const [studentById, _] = await db.execute(`
            SELECT *, academic_year_name, payment_method_name FROM student
            INNER JOIN academic_year ON fk_id_academic_year = id_academic_year
            INNER JOIN payment_method ON fk_id_payment_method = id_payment_method
            WHERE id_student = ?
        `, [id]);

        if (studentById.length > 0) {
            res.status(200).json({ studentById });
        } else {
            res.status(200).json({ message: 'Any student with this Id' });

        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addNewStudent = async (req, res, next) => {
    try {
        // teacherID
        const teacherId = req.params.teacherId;
        //Datos del body de la solicitud
        const {
            studentName,
            studentSurname,
            studentEmail,
            studentBirthdate,
            studentPhone,
            studentPhoto,
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
            teacherId,
            fkIdAcademicYear,
            fkIdPaymentMethod
        ]);

        // Enviar respuesta
        res.status(201).json({ message: "Student successfully added", id_student: result[0].insertId });
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

const checkRepeatEmail = async (req, res, next) => {
    try {
        const teacherId = req.params.teacherId;
        const { studentEmail } = req.body;

        const studentQuery = 'SELECT * FROM student WHERE fk_id_teacher = ?';
        const [students] = await db.query(studentQuery, [teacherId]);

        // Comprobar si alguno de los estudiantes tiene el email proporcionado
        const emailExists = students.some(student => student.student_email === studentEmail);

        if (emailExists) {
            // Si se encuentra el email, enviar respuesta de conflicto
            res.status(409).json({ message: "Email already exists" });
        } else {
            // Si no se encuentra el email, enviar respuesta de éxito
            res.status(200).json({ message: "Email unique" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteStudentById = async (req, res, next) => {
    try {
        const idStudent = req.params.idStudent;
        const deleteSessionsQuery = `DELETE FROM session WHERE fk_id_student_subject IN (SELECT id_student_subject FROM student_subject WHERE fk_id_student = ?)`;
        await db.execute(deleteSessionsQuery, [idStudent]);

        const deleteStudentSubjectQuery = `DELETE FROM student_subject WHERE fk_id_student = ?`;
        await db.execute(deleteStudentSubjectQuery, [idStudent]);

        const deleteStudentQuery = `DELETE FROM student WHERE id_student = ?`;
        const [result] = await db.execute(deleteStudentQuery, [idStudent]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Student and related entries deleted successfully' });
        } else {
            res.status(404).json({ message: 'Student not found or already deleted' });
        }
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = { getAllStudents, getStudentById, addNewStudent, updateStudent, getStudentsByTeacher, checkRepeatEmail, deleteStudentById };
