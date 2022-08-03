import mysql from 'mysql2';

export default function renderMainPage(req, res) {
    const newNote = req.query.note;//
    const model = {};
    model.title = 'My To-do App';
    
    const connection = connect();
    if(newNote) {
        
        connection.execute('INSERT notes(note) VALUES(?)', [newNote], (err, _) => {
            if(err) throw err;

            getNotes(connection)
                .then(notes => {
                    model.notes = notes;
                    res.render('index', {model});
                });
        });
    }
    else {
        getNotes(connection)
            .then(notes => {
                model.notes = notes;
                res.render('index', {model});
            })
    }
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
