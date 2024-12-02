const mysql = require('../db/db.js');

class Categories {
    createCategory(content, res) {
        const sql = 'INSERT INTO categories SET ?';

        mysql.query(sql, content, function(err, rows) {
            if(err) {
                res.status(400).json(err);
                return;
            }
            res.json("Success");
        });
    }
    getAllCategories(res) {
        const sql = 'SELECT * FROM categories';

        mysql.query(sql, function(err, rows) {
            if(err) {
                res.status(400).json(err);
                return;
            }
            res.json(rows);
        })
    }
    getCategoryById(id, res) {
        const sql = 'SELECT * FROM categories WHERE id=?';

        mysql.query(sql, id, function(err, rows) {
            if(err) {
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

    getPostByCategory(id, res) {
        const sql = 'SELECT * FROM categories WHERE id=?';

        mysql.query(sql, id, function(err, rows) {
            if(err) {
                res.status(400).json(err);
                return;
            }
            if(rows.length == 0) {
                res.status(400).json('Not found');
                return;
            }

            let categories = rows[0].title;

            mysql.query('SELECT * FROM posts', function(err, rows) {
                if(err) {
                    res.status(400).json(err);
                    return;
                }

                let resultArr = [];

                rows.forEach(element => {
                    if(element.categories.includes(categories)) {
                        resultArr.push(element);
                    }
                });
                res.json(resultArr);
            })
        })
    }
    changeCategories(id, content, res) {
        const sql = `UPDATE categories SET ? WHERE id="${id}"`;

        mysql.query(sql, content, function(err, rows) {
            if(err) {
                res.status(400).json(err);
                return;
            }
            res.json("Success");
        });
    }

    deleteCategories(id, res) {
        const sql = 'DELETE FROM categories WHERE id=?';

        mysql.query(sql, id, function(err, rows) {
            if(err) {
                res.status(400).json(err);
                return;
            }
            res.json("Success");
        })
    }
}

module.exports = new Categories();