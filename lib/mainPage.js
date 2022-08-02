import mysql from 'mysql2';

export default function renderMainPage(req, res) {
    const newNote = req.query.note;//
    const model = {};
    model.title = 'My To-do App';
    // if(newNote) {//
    //     notes.push(newNote);//
    // }//
    connect().execute('SELECT note from notes;', (err, rows) => {
        if(err) throw err;
        const notes = rows.map(row => row.note);
        model.notes = notes;

        res.render('index', {model})
    })
}

function connect() {
    return mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'todoapp',
        password: 'bit',
        database: 'todoapp'
    });
}