const db = require('../config/dbConfig');

const getAllAcademicYears = async (req, res, next) => {
    try {
        const [academicYears, _] = await db.execute('SELECT * FROM academic_year');
        res.status(200).json({ academicYears });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAcademicYeartById = async (req, res, next) => {
    try {
        //cogemos el parametro de ID
        const id = req.params.id;

        const [academicYears, _] = await db.execute('SELECT * FROM academic_year WHERE id_academic_year = ?', [id]);
        
        if(academicYears.length > 0){
            res.status(200).json({ academicYears });
        } else {
        res.status(200).json({ message: 'Any academic_year with this ID' });
            
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllAcademicYears, getAcademicYeartById };
