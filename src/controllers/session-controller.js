const db = require('../config/dbConfig');

const getAllSessionsByTeacher = async (req, res, next) => {
    try {
        // Obtener el ID del estudiante
        const teacherId = req.params.teacherId;

        const query = `
            SELECT id_session, session_name, session_objective, session_start, session_end, session_tasks, session_material, session_payed, fk_id_student_subject, create_at_session, update_at_session, student_name, id_student, subject_name, id_subject FROM session
            INNER JOIN student_subject ON fk_id_student_subject = id_student_subject
            INNER JOIN subject ON fk_id_subject = id_subject
            INNER JOIN student ON fk_id_student = id_student
            INNER JOIN teacher ON fk_id_teacher = id_teacher
            WHERE id_teacher = ?;
        `;

        const [sessions, _] = await db.execute(query, [teacherId]);

        if (sessions.length > 0) {
            res.status(200).json({ sessions });
        } else {
            res.status(200).json({ message: 'Any sessions for this teacher' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getSessionsByStudent = async (req, res, next) => {
    try {
        // Obtener el ID del estudiante
        const studentId = req.params.studentId;

        const query = `
            SELECT id_session, session_name, session_objective, session_start, session_end, session_tasks, session_material, session_payed, fk_id_student_subject, create_at_session, update_at_session, student_name, id_student, subject_name, id_subject FROM session
            INNER JOIN student_subject ON fk_id_student_subject = id_student_subject
            INNER JOIN subject ON fk_id_subject = id_subject
            INNER JOIN student ON fk_id_student = id_student
            INNER JOIN teacher ON fk_id_teacher = id_teacher
            WHERE fk_id_student = ?;
        `;

        const [sessions, _] = await db.execute(query, [studentId]);

        if (sessions.length > 0) {
            res.status(200).json({ sessions });
        } else {
            res.status(200).json({ message: 'Any sessions for this student' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSessionById = async (req, res, next) => {
    try {
        //cogemos el parametro de ID
        const id = req.params.id;

        const [sessions, _] = await db.execute(`SELECT id_session, session_name, session_objective, session_start, session_end, session_tasks, session_material, session_payed, fk_id_student_subject, create_at_session, update_at_session, student_name, id_student, subject_name, id_subject FROM session
        INNER JOIN student_subject ON fk_id_student_subject = id_student_subject
        INNER JOIN subject ON fk_id_subject = id_subject
        INNER JOIN student ON fk_id_student = id_student
        INNER JOIN teacher ON fk_id_teacher = id_teacher
        WHERE id_session = ?`, [id]);

        if (sessions.length > 0) {
            res.status(200).json({ sessions });
        } else {
            res.status(200).json({ message: 'Any session with this ID' });

        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addNewSession = async (req, res, next) => {
    try {
        // datos del body
        const { sessionName,
            sessionObjective,
            sessionStart,
            sessionEnd,
            sessionTasks,
            sessionMaterial } = req.body;

        const fkIdStudentSubject = req.params.fkIdStudentSubject;
        const sessionPayed = false;

        const query = `
            INSERT INTO session (
                session_name, 
                session_objective, 
                session_start, 
                session_end, 
                session_tasks,
                session_material, 
                session_payed, 
                fk_id_student_subject
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await db.execute(query, [
            sessionName,
            sessionObjective,
            sessionStart,
            sessionEnd,
            sessionTasks,
            sessionMaterial,
            sessionPayed,
            fkIdStudentSubject
        ]);

        res.status(201).json({ message: "Session successfully added", sessionId: result[0].insertId });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSession = async (req, res, next) => {
    try {
        //id de session
        const id = req.params.id;
        const { sessionName, sessionObjective, sessionStart, sessionEnd, sessionTasks, sessionMaterial, sessionPayed, fkIdStudentSubject } = req.body;

        const query = `
            UPDATE session
            SET session_name = ?, 
                session_objective = ?, 
                session_start = ?, 
                session_end = ?, 
                session_tasks = ?,
                session_material = ?, 
                session_payed = ?,
                fk_id_student_subject = ?
            WHERE id_session = ?
        `;

        const [result] = await db.execute(query, [
            sessionName,
            sessionObjective,
            sessionStart,
            sessionEnd,
            sessionTasks,
            sessionMaterial,
            sessionPayed,
            fkIdStudentSubject,
            id
        ]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Session successfully updated" });
        } else {
            res.status(404).json({ message: "Any session with this ID" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPayedSessions = async (req, res, next ) => {
    try {
        // Obtener el ID del estudiante
        const teacherId = req.params.teacherId;

        const query = `
            SELECT id_session, session_name, session_objective, session_start, session_end, session_tasks, session_material, session_payed, fk_id_student_subject, create_at_session, update_at_session, student_name, id_student, subject_name, id_subject FROM session
            INNER JOIN student_subject ON fk_id_student_subject = id_student_subject
            INNER JOIN subject ON fk_id_subject = id_subject
            INNER JOIN student ON fk_id_student = id_student
            INNER JOIN teacher ON fk_id_teacher = id_teacher
            WHERE id_teacher = ? AND session_payed = true;
        `;

        const [sessions, _] = await db.execute(query, [teacherId]);

        if (sessions.length > 0) {
            res.status(200).json({ sessions });
        } else {
            res.status(200).json({ message: 'Any sessions for this teacher' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getNotPayedSessions = async (req, res, next ) => {
    try {
        // Obtener el ID del estudiante
        const teacherId = req.params.teacherId;

        const query = `
            SELECT id_session, session_name, session_objective, session_start, session_end, session_tasks, session_material, session_payed, fk_id_student_subject, create_at_session, update_at_session, student_name, id_student, subject_name, id_subject FROM session
            INNER JOIN student_subject ON fk_id_student_subject = id_student_subject
            INNER JOIN subject ON fk_id_subject = id_subject
            INNER JOIN student ON fk_id_student = id_student
            INNER JOIN teacher ON fk_id_teacher = id_teacher
            WHERE id_teacher = ? AND session_payed = false;
        `;

        const [sessions, _] = await db.execute(query, [teacherId]);

        if (sessions.length > 0) {
            res.status(200).json({ sessions });
        } else {
            res.status(200).json({ message: 'Any sessions for this teacher' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteSessionById = async (req, res, next) => {
    try {
        // Obtener el ID del estudiante
        const idSession = req.params.idSession;

        const query = `DELETE from session WHERE id_session = ?`;

        const [result] = await db.execute(query, [idSession]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'session deleted successfully' });
        } else {
            res.status(200).json({ message: 'session not found or already deleated' });
        }
    }
    catch (error) {
        console.error('Error deleting sessio:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllSessionsByTeacher, getSessionsByStudent, getSessionById, addNewSession, updateSession, getPayedSessions, getNotPayedSessions, deleteSessionById };
