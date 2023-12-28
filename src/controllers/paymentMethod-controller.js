const db = require('../config/dbConfig');


const getAllPaymentMethods = async (req, res, next) => {
    try {
        const [paymentMethods, _] = await db.execute('SELECT * FROM payment_method');
        res.status(200).json({ paymentMethods });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPaymentMethodById = async (req, res, next) => {
    try {
        //cogemos el parametro de ID
        const id = req.params.id;

        const [paymentMethods, _] = await db.execute('SELECT * FROM payment_method WHERE id_payment_method = ?', [id]);
        
        if(paymentMethods.length > 0){
            res.status(200).json({ paymentMethods });
        } else {
        res.status(200).json({ message: 'Any payment_method with this ID' });
            
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllPaymentMethods, getPaymentMethodById };
