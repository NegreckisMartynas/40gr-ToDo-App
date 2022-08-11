import { connect, getConnection, releaseConnection } from "./connect.js";
import * as db from "./database.js";

export function getNotes(req, res) {
    const model = {};
    model.title = 'My To-do App';


    
    Promise.resolve()
        .then(_ => authenticate(req))
        .then(userId => Promise.all([
            db.selectNotes(connect(), userId),
            db.selectStyles(connect())
        ]))
        .then(([notes, styles]) => ({...model, notes, styles}))
        .then(model => res.render('index', {model}))
        .catch(err => {
            if(err === 'no auth') {
                return res.redirect('/login')
            }
            console.log(err);
            res.render('error', {model: {errorName: err.name, message: err.message, stack: err.stack}});
        });

}

export function addNote(req, res) {
    console.log(req.body);
    const {note, priority, style} = req.body;
    Promise.resolve()
        .then(_ => authenticate(req))
        .then(async userId => ([userId, await getConnection()]))
        .then(async ([userId, connection]) => {
            await db.insertNote(connection, note, priority, userId); 
            return connection; // pass same connection for other queries
        })
        .then(async connection => {
            const id = await db.lastInsertRow(connection);
            return [id, connection];
        })
        .then(([noteId, connection]) => {
            db.insertStyle(connection, noteId, style)
              .then(_ => releaseConnection(connection));
        })
        .then(_ => res.redirect('/'))
        .catch(err => {
            console.log(err);
            res.render('error', {model: {errorName: err.name, message: err.message, stack: err.stack}});
        });
} 

export function deleteNote(req, res) {
    const noteId = req.query.id;
    const connection = connect();
    Promise.resolve()
        .then(_ => authenticate(req))
        .then(userId => db.deleteNote(connection, noteId, userId))
        .then(_ => res.redirect(303, '/'))
        .catch(err => {
            console.log(err);
            res.render('error', {model: {errorName: err.name, message: err.message, stack: err.stack}});
        });
}

export function updateNote(req, res) {
    const id = req.body.id;
    const note = req.body.note;
    Promise.resolve()
           .then(_ => db.updateNote(connect(), id, note))
           .then(_ => res.status(200).send())
           .catch(err => {
                console.log(err);
                res.status(400).send();
            })
}

async function authenticate(req) {
    const token = req.cookies.authToken || '';
    const tokenData = await db.selectToken(connect(), token);
    if(!tokenData) {
        throw 'no auth';
    }
    console.log(tokenData);
    return tokenData.userId;
}