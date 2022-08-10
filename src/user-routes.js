import bcrypt from 'bcrypt';
import * as db from "./database.js";
import {connect} from "./connect.js";
//send registration page
export function startRegistration(req, res) {
    let error = null;
    switch(req.query.error) {
        case 'existingUser':
            error = 'User already exists';
        case 'shortPassword':
            error = 'Password is too short';
    }
    res.render('registration', {model: {error} });
}

//register user or redirect back on error
export function handleRegistration(req, res) {
    //{"username":"Vardenis","password":"bit"}
    Promise.resolve()
           .then(_ => {
                if(req.body.password.length <= 4) {
                    const error = new Error('Password too short');
                    error.code = 'ER_SHORT_PASSWORD';
                    throw error;
                }
           })
           .then(_ => bcrypt.hash(req.body.password, 12))
           .then(hash => db.insertUser(connect(), req.body.username, hash))
           .then(_ => res.redirect('/login'))
           .catch(err => {
                let errorType;
                switch(err.code) {
                    case 'ER_DUP_ENTRY': 
                        errorType = 'existingUser'; break;
                    case 'ER_SHORT_PASSWORD': 
                        errorType = 'shortPassword'; break;
                    default:
                        console.log(err);
                        errorType = 'unknown'; break;
                }
                res.redirect(`/register?error=${errorType}`);
            })
}

//send login page
export function loginPage(req, res) {
    res.send('Login page');
}

//login user or send back on error
export function handleLogin(req, res) {

}