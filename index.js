import express from 'express';
import handlebars from 'express-handlebars';
import {getNotes, addNote, deleteNote, updateNote} from './src/routes.js';

const app = express();
const port = 8081;
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.set('view engine', 'hbs');
app.engine('hbs', handlebars.engine({
    extname: 'hbs'
}));

app.get('/', getNotes);
app.post('/', addNote);
app.delete('/', deleteNote);
app.patch('/', updateNote);

app.get('/edit', (req, res) => res.render('editStyle'));
app.post('/edit', (req, res) => /* req.body == submitted form; insert into styles table*/ res.send('WIP'));

app.listen(port, () => console.log(`Starting server on port ${port}`));