const db = require('../config/dbConfig');

const getSessionsByStudent = async (req, res, next) => {
    try {
        // Obtener el ID del estudiante
        const studentId = req.params.studentId;

        const query = `
            SELECT * FROM session
            JOIN student_subject ON fk_id_student_subject = id_student_subject
            WHERE fk_id_student = ?
        `;

        const [sessions, _] = await db.execute(query, [studentId]);

        if(sessions.length > 0){
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

        const [sessions, _] = await db.execute('SELECT * FROM session WHERE id_session = ?', [id]);
        
        if(sessions.length > 0){
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
        const { session_name, session_objective, session_start, session_end, session_tasks, session_payed } = req.body;
        const fk_id_student_subject = req.params.id_student_subject;

        const query = `
            INSERT INTO session (
                session_name, 
                session_objective, 
                session_start, 
                session_end, 
                session_tasks, 
                session_payed, 
                fk_id_student_subject
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await db.execute(query, [
            session_name, 
            session_objective, 
            session_start, 
            session_end, 
            session_tasks, 
            session_payed, 
            fk_id_student_subject
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
        const { session_name, session_objective, session_start, session_end, session_tasks, session_payed } = req.body;

        const query = `
            UPDATE session
            SET session_name = ?, 
                session_objective = ?, 
                session_start = ?, 
                session_end = ?, 
                session_tasks = ?, 
                session_payed = ?
            WHERE id_session = ?
        `;
        
        const [result] = await db.execute(query, [
            session_name, 
            session_objective, 
            session_start, 
            session_end, 
            session_tasks, 
            session_payed, 
            id
        ]);

        if(result.affectedRows > 0){
            res.status(200).json({ message: "Session successfully updated" });
        } else {
            res.status(404).json({ message: "Any session with this ID" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getSessionsByStudent, getSessionById, addNewSession, updateSession };
