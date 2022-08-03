import express from 'express';
import handlebars from 'express-handlebars';
import mysql from 'mysql2';
import mainPage from './lib/mainPage.js';

const app = express();
const port = 8081;
app.use(express.static('public'));

app.set('view engine', 'hbs');
app.engine('hbs', handlebars.engine({
    extname: 'hbs'
}));

app.get('/', mainPage);


app.listen(port, () => console.log(`Starting server on port ${port}`));