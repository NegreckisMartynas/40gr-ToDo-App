export async function selectNotes(connection) {
    return await new Promise((resolve, reject) => {
        connection.execute('SELECT noteId, note, priority from notes ORDER BY priority DESC;', (err, rows) => {
            if(err) return reject(err);

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