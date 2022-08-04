import { connect } from "./connect.js";
import * as db from "./database.js";

export function getNotes(req, res) {
    const model = {};
    model.title = 'My To-do App';
    
    const connection = connect();
    Promise.resolve()
        .then(_ => db.selectNotes(connection))
        .then(notes => ({...model, notes}))
        .then(model => res.render('index', {model}))
        .catch(err => {
            console.log(err);
            res.render('error', {model: {errorName: err.name, message: err.message, stack: err.stack}});
        });

}

export function addNote(req, res) {
    const newNote = req.body.note;
    const connection = connect();
    Promise.resolve()
        .then(_ => db.insertNote(connection, newNote))
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
        .then(_ => db.deleteNote(connection, id))
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