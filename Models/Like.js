const mysql = require('../db/db.js');

class Like {
    getPostLike(id, res) {
        const sql = 'SELECT * FROM likes WHERE idPost=?';

        mysql.query(sql, id, function(err, rows) {
            if(err) {
                res.status(400).json(err);
                return;
            }
            if(rows.length == 0) {
                res.status(404).json('Post not found');
                return;
            }
            let resArr = [];

            rows.forEach(element => {
                resArr.push(Object.assign(element, {count: rows.length}));
            });
            res.json(resArr);
        });
    }
    
    setLikePost(id, login, res) {
        const checkLike = 'SELECT * FROM likes WHERE login=?';

        mysql.query(checkLike, login, function(err, rows) {
            if(err) {
                res.status(400).json(err);
                return;
            }
            let flag = true;
            rows.forEach(element => {
                if(element.idPost == id) {
                    flag = false;
                }
            });

            if(!flag) {
                res.status(400).json('User already like post');
                return;
            }
            const sql = `UPDATE posts SET rating = rating + 1 WHERE id="${id}"`

            mysql.query(sql, function(err, rows) {
                if(err) {
                    res.status(400).json(err);
                    return;
                }
                if(rows.affectedRows == 0) {
                    res.status(200).json('Post already delete');
                    return;
                }
                mysql.query('INSERT INTO likes SET ?', {login: login, idPost: id}, function(err, rows) {
                    if(err) {
                        res.status(400).json(err);
                        return;
                    }
                    mysql.query('SELECT * FROM posts WHERE id=?', id, function(err, rows) {
                        if(err) {
                            res.status(400).json(err);
                            return;
                        }
                        mysql.query(`UPDATE users SET rating = rating + 1 WHERE login="${rows[0].owner}"`, function(err, rows) {
                            if(err) {
                                res.status(400).json(err);
                                return;
                            }
                            res.json('Success');
                        }); 
                    });
                });
            });
        });
    }

    deleteLikePost(id, login, res) {
        const checkLike = 'SELECT * FROM likes WHERE login=?';

        mysql.query(checkLike, login, function(err, rows) {
            if(err) {
                res.status(400).json(err);
                return;
            }
            let flag = true;
            rows.forEach(element => {
                if(element.idPost == id) {
                    flag = false;
                }
            });

            if(flag) {
                res.status(400).json('User dont like post');
                return;
            }
            const sql = `UPDATE posts SET rating = rating - 1 WHERE id="${id}"`

            mysql.query(sql, function(err, rows) {
                if(err) {
                    res.status(400).json(err);
                    return;
                }
                if(rows.affectedRows == 0) {
                    res.status(200).json('Post already delete');
                    return;
                }
                mysql.query(`DELETE FROM likes WHERE idPost="${id}"`,function(err, rows) {
                    if(err) {
                        res.status(400).json(err);
                        return;
                    }
                    mysql.query('SELECT * FROM posts WHERE id=?', id, function(err, rows) {
                        if(err) {
                            res.status(400).json(err);
                            return;
                        }
                        mysql.query(`UPDATE users SET rating = rating - 1 WHERE login="${rows[0].owner}"`, function(err, rows) {
                            if(err) {
                                res.status(400).json(err);
                                return;
                            }
                            res.json('Success');
                        }); 
                    });
                });
            });
        });
    }

    setLikeComm(id, login, res) {
        const checkLike = 'SELECT * FROM commLike WHERE login=?';

        mysql.query(checkLike, login, function(err, rows) {
            if(err) {
                res.status(400).json(err);
                return;
            }
            let flag = true;
            rows.forEach(element => {
                if(element.idComm == id) {
                    flag = false;
                }
            });

            if(!flag) {
                res.status(400).json('User already like comment');
                return;
            }
            const sql = `UPDATE comments SET rating = rating + 1 WHERE id="${id}"`

            mysql.query(sql, function(err, rows) {
                if(err) {
                    res.status(400).json(err);
                    return;
                }
                if(rows.affectedRows == 0) {
                    res.status(200).json('Post already delete');
                    return;
                }
                mysql.query('INSERT INTO commLike SET ?', {login: login, idComm: id}, function(err, rows) {
                    if(err) {
                        res.status(400).json(err);
                        return;
                    }
                    mysql.query('SELECT * FROM comments WHERE id=?', id, function(err, rows) {
                        if(err) {
                            res.status(400).json(err);
                            return;
                        }
                        mysql.query(`UPDATE users SET rating = rating + 1 WHERE login="${rows[0].owner}"`, function(err, rows) {
                            if(err) {
                                res.status(400).json(err);
                                return;
                            }
                            res.json('Success');
                        }); 
                    });
                });
            });
        });
    }

    deleteLikeComm(id, login, res) {
        const checkLike = 'SELECT * FROM commLike WHERE login=?';

        mysql.query(checkLike, login, function(err, rows) {
            if(err) {
                res.status(400).json(err);
                return;
            }
            let flag = true;
            rows.forEach(element => {
                if(element.idComm == id) {
                    flag = false;
                }
            });

            if(flag) {
                res.status(400).json('User dont like comment');
                return;
            }
            const sql = `UPDATE comments SET rating = rating - 1 WHERE id="${id}"`

            mysql.query(sql, function(err, rows) {
                if(err) {
                    res.status(400).json(err);
                    return;
                }
                if(rows.affectedRows == 0) {
                    res.status(200).json('Post already delete');
                    return;
                }
                mysql.query(`DELETE FROM commLike WHERE idComm="${id}"`,function(err, rows) {
                    if(err) {
                        res.status(400).json(err);
                        return;
                    }
                    mysql.query('SELECT * FROM comments WHERE id=?', id, function(err, rows) {
                        if(err) {
                            res.status(400).json(err);
                            return;
                        }
                        mysql.query(`UPDATE users SET rating = rating - 1 WHERE login="${rows[0].owner}"`, function(err, rows) {
                            if(err) {
                                res.status(400).json(err);
                                return;
                            }
                            res.json('Success');
                        }); 
                    });
                });
            });
        });
    }
    getCommLikes(id, res) {
        const sql = 'SELECT * FROM commLike WHERE idComm=?';

        mysql.query(sql, id, function(err, rows) {
            if(err) {
                res.status(400).json(err);
                return;
            }

            let resArr = [];

            rows.forEach(element => {
                resArr.push(Object.assign(element, {count: rows.length}));
            });
            res.json(resArr);
        })
    }
}

module.exports = new Like();