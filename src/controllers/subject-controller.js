const db = require('../config/dbConfig');

const getAllSubjects = async (req, res, next) => {
    try {
        const [subjects, _] = await db.execute('SELECT * FROM subject');
        res.status(200).json({ subjects });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSubjectById = async (req, res, next) => {
    try {
        //cogemos el parametro de ID
        const id = req.params.id;

        const [subjects, _] = await db.execute('SELECT * FROM subject WHERE id_subject = ?', [id]);
        
        if(subjects.length > 0){
            res.status(200).json({ subjects });
        } else {
        res.status(200).json({ message: 'Any subject with this ID' });
            
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllSubjects, getSubjectById };
