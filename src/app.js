const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); //permite llegar peticiones desde otro servidor

//importar todas las rutas
const teacher = require('./routes/teacher-routes')
const academicYear = require('./routes/academicYear-routes')
const observation = require('./routes/observation-routes')
const paymentMethod = require('./routes/paymentMethod-routes')
const session = require('./routes/session-routes')
const sessionValoration = require('./routes/sessionValoration-routes')
const student = require('./routes/student-routes')
const studentObservation = require('./routes/studentObservation-routes')
const studentSubject = require('./routes/studentSubject-routes')
const subject = require('./routes/subject-routes')


const app = express();

app.use(cors());
app.use(bodyParser.json());

//routes
app.use('/api/teacher', teacher);
app.use('/api/academic-year', academicYear);
// app.use('/api/observation', observation);
app.use('/api/payment-method', paymentMethod);
app.use('/api/session', session);
app.use('/api/session-valoration', sessionValoration);
app.use('/api/student', student);
// app.use('/api/studentObservation', studentObservation);
// app.use('/api/studentSubject', studentSubject);
app.use('/api/subject', subject);


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Servidor conectado port => ", port)
});

