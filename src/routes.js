import { connect } from "./connect.js";
import * as db from "./database.js";
import { asyncPipe, withSameConnection } from "./util.js"; 

export function getNotes(req, res) {
    asyncPipeWithMap(
        (_, map) => map.set('title', 'My To-do App'), //example is simple enough to not need it, but it's there in case someone finds use case
        _ => authenticate(req),
        userId => Promise.all([
            db.selectNotes(connect(), userId),
            db.selectStyles(connect()),  
        ]),
        ([notes, styles], map) => ({...map.get('title'), notes, styles}),
        model => res.render('index', {model})
    ).catch(err => redirectOnNoAuth(err, res)) //catch error thrown by authenticate and redirect
     .catch(err => renderError(err, res)); // else render generic error page
}

export function addNote(req, res) {
    const {note, priority, style} = req.body;
    asyncPipe(
        _ => authenticate(req),
        userId => withSameConnection(
            (connection)         => db.insertNote(connection, note, priority, userId),
            (connection)         => db.lastInsertRow(connection),
            (connection, noteId) => db.insertStyle(connection, noteId, style)
        ),
        
        _ => res.redirect('/')
    ).catch(err => redirectOnNoAuth(err, res))
     .catch(err => renderError(err, res));

} 

export function deleteNote(req, res) {
    const noteId = req.query.id;
    asyncPipe(
        _ => authenticate(req),
        userId => db.deleteNote(connect(), noteId, userId),
        _ => res.redirect(303, '/')
    ).catch(err => redirectOnNoAuth(err, res))
     .catch(err => renderError(err, res));
}

//REST api
export function updateNote(req, res) {
    const [id, note] = req.body;
    asyncPipe(
        _ => authenticate(req),
        userId => db.updateNote(connect(), id, note, userId),
        _ => res.status(200).send()
    ).catch(err => onNoAuthDo(err, _ => res.status(403).send()))
     .catch(err => {
        console.error(err);
        res.status(400).send();
     })
}

async function authenticate(req) {
    const token = req.cookies.authToken || '';
    const tokenData = await db.selectToken(connect(), token);
    if(!tokenData) {
        throw 'no auth';
    }
    return tokenData.userId;
}

function onNoAuthDo(err, callback) {
    if(err === 'no auth') return callback;
    else throw err;
}

function redirectOnNoAuth(err, res) {
    onNoAuthDo(err, _ => res.redirect('/login'));
}

function renderError(err, res) {
    console.error(err);
    res.render('error', {model: {errorName: err.name, message: err.message, stack: err.stack}});
}