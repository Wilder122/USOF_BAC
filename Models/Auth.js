const mysql = require('../db/db.js');
const bcrypt = require('bcrypt');
const TokenService = require('../services/tocken-service');
const MailService = require('../services/mail-service');
const uuid = require('uuid');
const shortid = require('shortid');
const saltRounds = 10;

class Auth {

    async register(user, res) {
        let sqlUser = {
            login: user.login,
            pass: bcrypt.hashSync(user.pass, bcrypt.genSaltSync(saltRounds)),
            fullName: user.fullName,
            profilePicture: 'user.png',
            rating: 0,
            email: user.email
        };

        const sql = 'INSERT INTO users SET ?';

        mysql.query(sql, sqlUser, async function (err, result ,rows) {
            if (err) {
               res.status(400).json(err);
               return;
            }
            const activationLink = uuid.v4();
            await MailService.sendActivationMail(user.email, `http://localhost:3001/api/auth/activate/${activationLink}/${result.insertId}`);
            let tokens = TokenService.generateTokens({
                login: user.login,
                email: user.email,
                id: result.insertId,
                roles: 'user',
                profilePicture: user.profilePicture
            });
            
            TokenService.saveTocken(user.login, tokens.refreshToken);

            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            
            res.json({accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    login: user.login,
                    email: user.email,
                    id: result.insertId,
                    roles: 'user'
                });
        });

    }

    activate(id, res) {
        const sql = `UPDATE users SET isActivated=true WHERE id="${id}"`;
        mysql.query(sql, function(err, rows) {
            if(err) {
                res.status(400).json(err);
                return;
            }
            res.redirect('http://google.com');
        })
    }

    login(user, res) {
        const sql = 'SELECT * FROM users WHERE login=?';

        mysql.query(sql, user.login ,function(err, rows) {
            if (err) {
                res.status(400).json('Unknown login error');
                return;
            }
            if (rows.length == 0) {
                res.status(400).json('User with this login is not found!');
                return;
            }

            let isPassword = bcrypt.compareSync(user.pass, rows[0].pass);
            if (isPassword) {
                let tokens = TokenService.generateTokens({
                    login: rows[0].login,
                    email: rows[0].email,
                    id: rows[0].id,
                    roles: rows[0].roles,
                    isActivated: rows[0].isActivated,
                    profilePicture: rows[0].profilePicture
                });
                
                TokenService.saveTocken(rows[0].login, tokens.refreshToken);
    
                res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

                res.json({accessToken: tokens.accessToken,
                        refreshToken: tokens.refreshToken,
                        login: rows[0].login,
                        email: rows[0].email,
                        id: rows[0].id,
                        roles: rows[0].roles,
                        isActivated: rows[0].isActivated
                });

            }
            else {
                res.status(400).json('Incorrect password');
                return
            }

        })
    }

    resetPass(email, res) {
        const newPassword = shortid.generate();
        let new_has = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(saltRounds));
        const sql = `UPDATE users SET pass="${new_has}" WHERE email="${email}"`

        mysql.query(sql, async function(err, rows) {
            if(err) {
                res.status(400).json(err);
                return;
            }
            await MailService.sendPass(email, newPassword);
            res.json('Succes');
        });
    }

    logout(refreshToken) {
        TokenService.removeToken(refreshToken);
    }

    refresh(refreshToken, res) {
        if (!refreshToken) {
            res.status(401).json('UnauthorizedError');
            return;
        }
        const userData = TokenService.validateRefreshToken(refreshToken);
        if(!userData) {
            res.status(401).json('UnauthorizedError');
            return;
        }

        mysql.query('SELECT * FROM tokens WHERE refreshTocken=?', refreshToken, function(err, rows) {
            if(err) {
                res.status(401).json('UnauthorizedError');
                return;
            }
            let tokens = TokenService.generateTokens({
                login: userData.login,
                email: userData.email,
                id: userData.id,
                roles: userData.roles,
                isActivated: userData.isActivated
            });
            
            TokenService.saveTocken(userData.login, tokens.refreshToken);

            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.json({accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                login: userData.login,
                email: userData.email,
                id: userData.id,
                roles: userData.roles,
                isActivated: userData.isActivated
            });
        })
    }
}

module.exports = new Auth();
