export async function selectNotes(connection, userId) {
    return await new Promise((resolve, reject) => {
        connection.execute('SELECT noteId, note, priority, `style` FROM notes_with_styles WHERE userId = ? ORDER BY priority DESC;', [userId], (err, rows) => {
            if(err) return reject(err);
            const notes = rows;
            return resolve(notes);
        })
    });
} 
export async function selectStyles(connection) {
    return await new Promise((resolve, reject) => {
        connection.execute('SELECT * FROM style', (err, rows) => {
            if(err) return reject(err);
            const notes = rows;
            return resolve(notes);
        })
    });
} 

export async function insertNote(connection, note, priority, userId) {
    priority = (!priority || priority.length == 0) ? '0' : priority;
    return await new Promise((resolve, reject) => {
        connection.execute('INSERT notes(note, priority, userId) VALUES(?, ?, ?)', [note, priority, userId], (err, _) => {
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
    if(style == '0') return; //guarding clause

    return await new Promise((resolve, reject) => {
        connection.execute('INSERT note_style(noteId, style) VALUES(?, ?)', [noteId, style], (err, result) => {
            if(err) return reject(err);
            resolve();
        });
    });
}

export async function deleteNote(connection, noteId, userId) {
    return await new Promise((resolve, reject) => {
        connection.execute('DELETE FROM notes WHERE noteId = ? AND userId = ?', [noteId, userId], (err, _) => {
            if(err) return reject(err);
            resolve();
        });
    })
}

export async function updateNote(connection, noteId, note, userId) {
    return await new Promise((resolve, reject) => {
        connection.execute('UPDATE notes SET note=? WHERE noteId=? AND userId=?', [note, noteId, userId], (err, _) => {
            if(err) return reject(err);
            resolve();
        });
    })
}

export async function insertUser(connection, username, hash) {
    return await new Promise((resolve, reject) => {
        connection.execute('INSERT users(username, passwordHash) VALUES(?, ?)', [username, hash], (err, _) => {
            if(err) return reject(err);
            resolve();
        });
    })
}

export async function selectUserByUsername(connection, username) {
    return await new Promise((resolve, reject) => {
        connection.execute('SELECT * FROM users WHERE username = ?;', [username] , (err, result) => {
            if(err) return reject(err);
            if(result.length === 0) return reject('No user');
            resolve(result[0]);
        });
    });
}

export async function insertToken(connection, token, userId) {
    return await new Promise((resolve, reject) => {
        connection.execute('INSERT loginTokens(userId, token) VALUES(?, ?)', [userId, token], (err, _) => {
            if(err) return reject(err);
            resolve();
        });
    })
}

export async function selectToken(connection, token) {
    return await new Promise((resolve, reject) => {
        connection.execute('SELECT * FROM loginTokens WHERE token = ?;', [token] , (err, result) => {
            if(err) return reject(err);
            resolve(result[0]);
        });
    });
}