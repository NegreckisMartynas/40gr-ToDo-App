import mysql from 'mysql2';

export default function renderMainPage(req, res) {
    const newNote = req.query.note;//
    const model = {};
    model.title = 'My To-do App';
    
    const connection = connect();
    if(newNote) {
        
        connection.execute('INSERT notes(note) VALUES(?)', [newNote], (err, _) => {
            if(err) throw err;

            connection.execute('SELECT note from notes;', (err, rows) => {
                if(err) throw err;
                const notes = rows.map(row => row.note);
                model.notes = notes;
    
                res.render('index', {model})
            })
        });
    }
    else {
        connection.execute('SELECT note from notes;', (err, rows) => {
            if(err) throw err;
            const notes = rows.map(row => row.note);
            model.notes = notes;

            res.render('index', {model})
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