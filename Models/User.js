const mysql = require('../db/db.js');
const bcrypt = require('bcrypt');
const UserService = require('../services/user-service');
const saltRounds = 10;

class User {
    getAllUsers(res) {
        const sql = 'SELECT * FROM users'
        mysql.query(sql, function (err, rows) {
            if (err) {
               res.status(400).json(err);
               return;
            }
            
            res.json(UserService.userDto(rows));
        });
    }

    getPostByUser(id, res) {
        const sql = 'SELECT * FROM posts WHERE idOwner=?'
        mysql.query(sql, id, function (err, rows) {
            if (err) {
               res.status(400).json(err);
               return;
            }
            
            res.json(rows);
        });
    }

    getUserById(id, res) {
        const sql = 'SELECT * FROM users WHERE id=?';

        mysql.query(sql, id, function(err, rows) {
            if(err) {
                res.status(400).json(err);
                return;
            }
            if (rows.length == 0) {
                res.status(400).json('User not found');
                return;
            }
            res.json(UserService.userDto(rows)[0]);
        })
    }
    createNewUser(user, res) {
        let sqlUser = {
            login: user.login,
            pass: bcrypt.hashSync(user.pass, bcrypt.genSaltSync(saltRounds)),
            fullName: user.fullName,
            profilePicture: user.profilePicture,
            rating: user.rating,
            email: user.email
        };

        const sql = 'INSERT INTO users SET ?';
        
        mysql.query(sql, sqlUser, function (err, result ,rows) {
            if (err) {
               res.status(400).json(err);
               return;
            }
            res.json("Success");
        });
    }

    addAvatar(login, path, res) {
        const sql = `UPDATE users SET profilePicture="${path}" WHERE login="${login}"`

        mysql.query(sql, function (err, result ,rows) {
            if (err) {
               res.status(400).json(err);
               return;
            }
            res.json(path);
        });
    }

    changeUser(user, authId, id, res) {
        const sql = `UPDATE users SET ? WHERE id="${id}"`;

        if (authId != id) {
            res.status(400).json('not avalible');
            return;
        }

        mysql.query(sql, user, function (err, result ,rows) {
            if (err) {
               res.status(400).json(err);
               return;
            }
            res.json("Success");
        });
    }

    deleteUser(id, res) {
        const sql = `DELETE FROM users WHERE id="${id}"`;

        mysql.query(sql, function(err, rows) {
            if(err) {
                res.status(200).json(err);
                return;
            }
            console.log(rows);
            if(rows.affectedRows == 0) {
                res.status(200).json('User already delete');
                return;
            }
            res.json('Success');
        });
        
    }
}

module.exports = new User();