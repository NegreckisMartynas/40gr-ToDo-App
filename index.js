import express from 'express';
import handlebars from 'express-handlebars';
import mysql from 'mysql2';

const app = express();
const port = 8081;
app.use(express.static('public'));

app.set('view engine', 'hbs');
app.engine('hbs', handlebars.engine({
    extname: 'hbs'
}));

app.get('/', (req, res) => res.render('index'));

// DB start
const connection = mysql.createConnection({
    host: 'localhost',
    database: 'classicmodels',
    user: 'classicmodels',
    password: 'bit'
})

app.get('/db', (req, res) => {
    connection.execute('SELECT productLine, textDescription FROM productlines', (err, rows) => {
        const data = rows.map(row => row);
        res.render('db', {data: data});
    });
})
//DB end


app.listen(port, () => console.log(`Starting server on port ${port}`));