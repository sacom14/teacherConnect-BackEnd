const db = require('../config/dbConfig');

const getSessionValorationBySession = async (req, res, next) => {
    try {
        // Id de la session
        const sessionId = req.params.sessionId;

        // Consulta SQL para obtener las sesiones del estudiante específico
        const query = `
            SELECT * FROM session_valoration
            WHERE fk_id_session = ?
        `;

        const [sessionValoration, _] = await db.execute(query, [sessionId]);

        if(sessionValoration.length > 0){
            res.status(200).json({ sessionValoration });
        } else {
            res.status(200).json({ message: 'Any session_vloration for this sessionId' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSessionValorationById = async (req, res, next) => {
    try {
        //cogemos el parametro de ID
        const id = req.params.id;

        const [sessionValoration, _] = await db.execute('SELECT * FROM session_valoration WHERE id_session_valoration = ?', [id]);
        
        if(sessionValoration.length > 0){
            res.status(200).json({ sessionValoration });
        } else {
        res.status(200).json({ message: 'Any sessionValoration with this id_session_valoration' });
            
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addNewSessionValoration = async (req, res, next) => {
    try {
        const { session_valoration_name, session_valoration_text } = req.body;
        const fk_id_session = req.params.id_session;

        // Comprobar si ya existe una session_valoration para esta session_id
        const checkQuery = 'SELECT * FROM session_valoration WHERE fk_id_session = ?';
        const [existingValoration, _] = await db.execute(checkQuery, [fk_id_session]);

        // Si ya existe una valoración, no insertar una nueva
        if (existingValoration.length > 0) {
            return res.status(409).json({ message: "A session_valoration for this session already exists" });
        }

        // Si no existe, inserta la nueva valoración
        const insertQuery = `
            INSERT INTO session_valoration (
                session_valoration_name, 
                session_valoration_text, 
                fk_id_session
            ) VALUES (?, ?, ?)
        `;
        const result = await db.execute(insertQuery, [
            session_valoration_name, 
            session_valoration_text, 
            fk_id_session
        ]);

        res.status(201).json({ message: "Session valuation successfully added", valuationId: result[0].insertId });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSessionValoration = async (req, res, next) => {
    try {
        // id session_valoration
        const id = req.params.id;
        const { session_valoration_name, session_valoration_text } = req.body;

        // Consulta SQL para actualizar la valoración (sin cambiar fk_id_session)
        const query = `
            UPDATE session_valoration
            SET session_valoration_name = ?, 
                session_valoration_text = ?
            WHERE id_session_valoration = ?
        `;
        
        // Ejecutar la consulta y manejar la respuesta
        const [result] = await db.execute(query, [
            session_valoration_name, 
            session_valoration_text, 
            id
        ]);

        if(result.affectedRows > 0){
            res.status(200).json({ message: "Session valoration successfully updated" });
        } else {
            res.status(404).json({ message: "Any session_valoration with this ID" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = { getSessionValorationBySession, getSessionValorationById, addNewSessionValoration, updateSessionValoration };
