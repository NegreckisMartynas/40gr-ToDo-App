import express from 'express';
import handlebars from 'express-handlebars';
import {renderMainPage, insertNewNote, deleteNote} from './lib/mainPage.js';

const app = express();
const port = 8081;
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.set('view engine', 'hbs');
app.engine('hbs', handlebars.engine({
    extname: 'hbs'
}));

app.get('/', renderMainPage);
app.post('/', insertNewNote);
app.delete('/', deleteNote);
app.patch('/', (req, res) => {
    console.log(req.body);
    res.redirect(303, '/')
})

app.listen(port, () => console.log(`Starting server on port ${port}`));