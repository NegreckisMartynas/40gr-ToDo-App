import bcrypt from 'bcrypt';
import * as db from "./database.js";
import {connect} from "./connect.js";
//send registration page
export function startRegistration(req, res) {
    res.render('registration');
}

//register user or redirect back on error
export function handleRegistration(req, res) {
    //{"username":"Vardenis","password":"bit"}
    Promise.resolve()
           .then(_ => bcrypt.hash(req.body.password, 12))
           .then(hash => db.insertUser(connect(), req.body.username, hash))
           .then(_ => res.redirect('/login'))
           .catch(err => {
                console.log(err);
                res.redirect('/register');
            })
}

//send login page
export function loginPage(req, res) {
    res.send('Login page');
}

//login user or send back on error
export function handleLogin(req, res) {

}