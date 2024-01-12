const db = require('../config/dbConfig');

const getAllStudentSubjects = async (req, res, next) => {
    try {
        const [studentSubjects, _] = await db.execute('SELECT * FROM student_subject');
        res.status(200).json({ studentSubjects });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSubjectsByStudent = async (req, res, next) => {
    try {
        // studentID
        const studentId = req.params.studentId;

        const query = `
            SELECT *, subject_name, student_name FROM student_subject
            INNER JOIN student ON fk_id_student = id_student
            INNER JOIN subject ON fk_id_subject = id_subject
            WHERE fk_id_student = ?
        `;

        const [subjects, _] = await db.execute(query, [studentId]);

        if (subjects.length > 0) {
            res.status(200).json({ subjects });
        } else {
            res.status(200).json({ message: 'Any subject for this student' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getStudentsBySubject = async (req, res, next) => {
    try {
        // subjectID
        const subjectId = req.params.subjectId;

        const query = `
            SELECT *, subject_name, student_name FROM student_subject
            INNER JOIN student ON fk_id_student = id_student
            INNER JOIN subject ON fk_id_subject = id_subject
            WHERE fk_id_subject = ?
        `;

        const [students, _] = await db.execute(query, [subjectId]);

        if (students.length > 0) {
            res.status(200).json({ students });
        } else {
            res.status(200).json({ message: 'Any student for this subject' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addNewStudentSubject = async (req, res, next) => {
    try {
        //Datos del body de la solicitud
        const {
            studentId,
            subjectId
        } = req.body;

        const query = `
            INSERT INTO student_subject (
                fk_id_student,
                fk_id_subject
            ) VALUES (?, ?)
        `;

        const result = await db.execute(query, [
            studentId,
            subjectId
        ]);

        // Enviar respuesta
        res.status(201).json({ message: "Student_subject successfully added", studentSubjectId: result[0].insertId });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { getAllStudentSubjects, getSubjectsByStudent, getStudentsBySubject, addNewStudentSubject };
