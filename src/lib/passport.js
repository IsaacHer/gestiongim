const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',    
    passReqToCallback: true

}, async (req, username, password, done) => {

    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length > 0) {

        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        
        if (validPassword) {
            done(null, user, req.flash('succsess', 'Welcome ' + user.username));
        } else {
            done(null, false, req.flash('message', 'Incorrect Password.'));
        }

    } else {
        return done(null, false, req.flash('message', 'The Username does not exists.'));
    }
}));

passport.use('local.signup', new localStrategy({
    
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true

}, async (req, username, password, done) => {

    const { fullname } = req.body;

    const newUSer = {
        username,
        password,
        fullname
    }
    
    newUSer.password = await helpers.encryptPassword(password);

    const result = await pool.query('INSERT INTO users SET ?', [newUSer]);
    newUSer.id = result.insertId;
    console.log(result);

    return done(null, newUSer);

}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const row = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, row[0]);
});