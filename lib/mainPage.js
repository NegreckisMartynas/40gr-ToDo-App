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
    const connection = connect();
    Promise.resolve()
        .then(_ => saveNote(connection, newNote))
        .then(_ => res.redirect('/'))
        .catch(err => {
            console.log(err);
            res.render('error', {model: {errorName: err.name, message: err.message, stack: err.stack}});
        });
} 

export function deleteNote(req, res) {
    const id = req.query.id;
    const connection = connect();
    Promise.resolve()
        .then(_ => deleteNoteById(connection, id))
        .then(_ => res.redirect(303, '/'))
        .catch(err => {
            console.log(err);
            res.render('error', {model: {errorName: err.name, message: err.message, stack: err.stack}});
        });
}

export function editNote(req, res) {
    const id = req.body.id;
    const note = req.body.note;
    Promise.resolve()
           .then(_ => saveNoteChanges(connect(), id, note))
           .then(_ => res.status(200).send())
           .catch(err => {
                console.log(err);
                res.status(400).send();
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

async function getNotes(connection) {
    return await new Promise((resolve, reject) => {
        connection.execute('SELECT noteId, note from notes;', (err, rows) => {
            if(err) return reject(err);

            const notes = rows;
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

async function deleteNoteById(connection, noteId) {
    return await new Promise((resolve, reject) => {
        connection.execute('DELETE FROM notes WHERE noteId = ?', [noteId], (err, _) => {
            if(err) return reject(err);
            resolve();
        });
    })
}

async function saveNoteChanges(connection, noteId, note) {
    return await new Promise((resolve, reject) => {
        connection.execute('UPDATE notes SET note=? WHERE noteId=?', [note, noteId], (err, _) => {
            if(err) return reject(err);
            resolve();
        });
    })
}