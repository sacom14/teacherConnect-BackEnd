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

const getStudentById = async (req, res, next) => {
    try {
        //cogemos el parametro de ID
        const id = req.params.id;

        const [students, _] = await db.execute('SELECT * FROM student WHERE id_student = ?', [id]);
        
        if(students.length > 0){
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
            student_name,
            student_surname,
            student_email,
            student_birthdate,
            student_phone,
            student_photo,
            fk_id_teacher,
            fk_id_academic_year,
            fk_id_payment_method
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
            student_name,
            student_surname,
            student_email,
            student_birthdate,
            student_phone,
            student_photo,
            fk_id_teacher,
            fk_id_academic_year,
            fk_id_payment_method
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
        const { student_name, student_surname, student_email, student_birthdate, student_phone, student_photo, fk_id_teacher, fk_id_academic_year, fk_id_payment_method } = req.body;

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
        const [result] = await db.execute(query, [student_name, student_surname, student_email, student_birthdate, student_phone, student_photo, fk_id_teacher, fk_id_academic_year, fk_id_payment_method, id]);

        if(result.affectedRows > 0){
            res.status(200).json({ message: "Student successfully updated" });
        } else {
            res.status(404).json({ message: "Any student with this ID" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllStudents, getStudentById, addNewStudent, updateStudent };
