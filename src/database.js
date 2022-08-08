export async function selectNotes(connection) {
    return await new Promise((resolve, reject) => {
        connection.execute('SELECT n.noteId, note, priority, style from notes n LEFT JOIN note_style ns ON n.noteId = ns.noteId ORDER BY priority DESC;', (err, rows) => {
            if(err) return reject(err);
            console.log(rows);
            const notes = rows;
            return resolve(notes);
        })
    });
} 

export async function insertNote(connection, note, priority) {
    return await new Promise((resolve, reject) => {
        connection.execute('INSERT notes(note, priority) VALUES(?, ?)', [note, priority], (err, _) => {
            if(err) return reject(err);
            resolve();
        });
    });
}

export async function lastInsertRow(connection) {
    return await new Promise((resolve, reject) => {
        connection.execute('SELECT id FROM last_insert_row;', (err, result) => {
            if(err) return reject(err);
            console.log('lastInsertRow');
            resolve(result[0].id);
        });
    });
}

export async function insertStyle(connection, noteId, style) {
    return await new Promise((resolve, reject) => {
        connection.execute('INSERT note_style(noteId, style) VALUES(?, ?)', [noteId, style], (err, result) => {
            if(err) return reject(err);
            resolve();
        });
    });
}

export async function deleteNote(connection, noteId) {
    return await new Promise((resolve, reject) => {
        connection.execute('DELETE FROM notes WHERE noteId = ?', [noteId], (err, _) => {
            if(err) return reject(err);
            resolve();
        });
    })
}

export async function updateNote(connection, noteId, note) {
    return await new Promise((resolve, reject) => {
        connection.execute('UPDATE notes SET note=? WHERE noteId=?', [note, noteId], (err, _) => {
            if(err) return reject(err);
            resolve();
        });
    })
}