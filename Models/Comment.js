const mysql = require('../db/db.js');

class Comment {
    createComment(id, idOwner,comment, owner, res) {
        let sqlComment = {
            owner: owner,
            idOwner: idOwner,
            content: comment.content,
            postId: id,
            date: new Date().toJSON().slice(0, 19).replace('T', ' ')
        }
        
        const sql = 'INSERT INTO comments SET ?';
        
        mysql.query(sql, sqlComment, function (err, result, rows) {
            if (err) {
               res.status(400).json(err);
               return;
            }
            res.json("Success");
        });
    }
    getAllComments(id, res) {
        const sql = 'SELECT * FROM comments WHERE postId=?';
        mysql.query(sql, id, function(err, rows){
            if (err) {
                res.status(400).json(err);
                return;
            }
            res.json(rows);
        });
    }
    getCommentById(id, res) {
        const sql = 'SELECT * FROM comments WHERE id=?';

        mysql.query(sql, id, function(err, rows) {
            if (err) {
                res.status(400).json(err);
                return;
            }
            if(rows.length == 0) {
                res.status(400).json('Not found');
                return;
            }
            res.json(rows[0]);
        })
    }

    changeComment(id, comment, login, res) {
        let sqlComment = {
            content: comment.content,
            status: comment.status,
            date: new Date().toJSON().slice(0, 19).replace('T', ' ')
        }
        mysql.query(`SELECT * FROM comments WHERE id="${id}"`, function(err, rows) {
            if (err) {
                res.status(400).json(err);
                return;
            }
            if(rows.length == 0) {
                res.status(400).json('Not found');
                return;
            }
            if(login != rows[0].owner && login != 'admin') {
                res.status(400).json('Not avalible');
                return;
            }
            if(login == 'admin' && rows[0].owner != 'admin') {
                sqlComment = {
                    status: comment.status,
                    date: new Date().toJSON().slice(0, 19).replace('T', ' ')
                }
            }
            const sql = `UPDATE comments SET ? WHERE id="${id}"`;
        
            mysql.query(sql, sqlComment, function (err, result, rows) {
                if (err) {
                res.status(400).json(err);
                return;
                }
                res.json("Success");
            });
        });
    }
    deleteComment(id, login, res) {
        mysql.query(`SELECT * FROM comments WHERE id="${id}"`, function(err, rows) {
            if (err) {
                res.status(400).json(err);
                return;
            }
            if(rows.length == 0) {
                res.status(400).json('Not found');
                return;
            }
            if(login != rows[0].owner && login != 'admin') {
                res.status(400).json('Not avalible');
                return;
            }
            const sql = `DELETE FROM comments WHERE id="${id}"`;
        
            mysql.query(sql, function (err, result, rows) {
                if (err) {
                    res.status(400).json(err);
                    return;
                }
                res.json("Success");
            });
        });
    }
}

module.exports = new Comment();