import mysql from 'mysql2';

export function renderMainPage(req, res) {
    const model = {};
    model.title = 'My To-do App';
    
    const connection = connect();
    Promise.resolve()
        .then(_ => getNotes(connection))
        .then(notes => ({...model, notes}))
        .then(model => res.render('index', {model}))
        .catch(err => {
            console.log(err);
            res.render('error', {model: {errorName: err.name, message: err.message, stack: err.stack}});
        });

}

export function insertNewNote(req, res) {
    const newNote = req.body.note;
    const model = {};
    model.title = 'My To-do App';

    const connection = connect();
    Promise.resolve()
        .then(_ => saveNote(connection, newNote))
        .then(_ => getNotes(connection))
        .then(notes => ({...model, notes}))
        .then(model => res.render('index', {model}))
        .catch(err => {
            console.log(err);
            res.render('error', {model: {errorName: err.name, message: err.message, stack: err.stack}});
        });
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

async function getNotes(connection) {
    return await new Promise((resolve, reject) => {
        connection.execute('SELECT note from notes;', (err, rows) => {
            if(err) return reject(err);

            const notes = rows.map(row => row.note);
            return resolve(notes);
        })
    });
} 

async function saveNote(connection, note) {
    return await new Promise((resolve, reject) => {
        connection.execute('INSERT notes(note) VALUES(?)', [note], (err, _) => {
            if(err) return reject(err);
            resolve();
        });
    });
}
