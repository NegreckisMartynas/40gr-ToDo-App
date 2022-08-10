import bcrypt from 'bcrypt';
import * as db from "./database.js";
import {connect} from "./connect.js";
import {v4 as uuid} from 'uuid';

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

    res.render('login', {model: {hasError: req.query.error}});
}

//login user or send back on error
export function handleLogin(req, res) {
    const {username, password} = req.body;
    //get password hash for username
    Promise.resolve()
           .then(_ => db.selectUserByUsername(connect(), username))
           .then(user => bcrypt.compare(password, user.passwordHash))
           .then(isCorrectPassword => {
                if(isCorrectPassword) {
                    const token = uuid();
                    res.cookie('authToken', token);
                    res.redirect('/');
                } else {
                    throw new Error('Invalid password')
                }
            })
            .catch(err => {
                console.log(err);
                res.redirect('/login?error=true');;
            })


    //if password matches: go to /
    //if password doesn't match: return to /login with error
}