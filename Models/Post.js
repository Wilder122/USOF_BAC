const mysql = require('../db/db.js');
const FilterService = require('../services/filter-service')

class Post {
    createPost(owner, idOwner, post, res) {
        let sqlPost = {
            owner: owner,
            title: post.title,
            idOwner: idOwner,
            content: post.content,
            categories: JSON.stringify(post.categories),
            date: new Date().toJSON().slice(0, 19).replace('T', ' ')
        }
        
        const sql = 'INSERT INTO posts SET ?';
        
        mysql.query(sql, sqlPost, function (err, result, rows) {
            if (err) {
               res.status(400).json(err);
               return;
            }
            res.json("Success");
        });
    }

    getAllPost(page, categories, date, sort, search, adminFlag, res) {
        let sql;
        
        if (categories || date) {
            sql = FilterService.getCategoriesSql(categories, date, adminFlag, null, null);
        }
        else {
            if(adminFlag) {
                sql = 'SELECT * FROM posts';
            }
            sql = 'SELECT * FROM posts WHERE status="active"';
        }
        
        const maxPostOnPage = 4;

        mysql.query(sql, function (err, rows) {
            if (err) {
               res.status(400).json(err);
               return;
            }
            const numOfResults = rows.length;
            const numberOfPages = Math.ceil(numOfResults / maxPostOnPage);

            const startingLimit = (page - 1) * maxPostOnPage;
            
            if(categories || date) {
                sql = FilterService.getCategoriesSql(categories, date, adminFlag, startingLimit, maxPostOnPage);
            }
            else {
                if(adminFlag) {
                    sql = `SELECT * FROM posts`;
                }
                sql = `SELECT * FROM posts WHERE status="active"`;
            }

            if(sort && !search) {
                let order = sort.split('-');
                sql += ` ORDER BY ${order[0]} ${order[1]} LIMIT ${startingLimit},${maxPostOnPage}`
            }
            else if(search && !sort) {
                sql += ` AND (title LIKE '%${search}%' OR content LIKE '%${search}%') ORDER BY rating DESC LIMIT ${startingLimit},${maxPostOnPage}`
            }
            else if (sort && search){
                let order = sort.split('-');
                sql += ` AND (title LIKE '%${search}%' OR content LIKE '%${search}%') ORDER BY ${order[0]} ${order[1]} LIMIT ${startingLimit},${maxPostOnPage}`
            } 
            else {
                sql += ` ORDER BY rating DESC LIMIT ${startingLimit},${maxPostOnPage}`;
            }
            mysql.query(sql, function (err, rows) {
                if(err) {
                    res.status(400).json(err);
                    return;
                }
                let resultArr = [];
                rows.forEach((element, i) => {
                    resultArr[i] = Object.assign(element, {pages: numberOfPages});
                });
                res.json(resultArr);
            })
        });
    }

    getPostById(id, res) {
        const sql = 'SELECT * FROM posts WHERE id=?';

        mysql.query(sql, id, function(err, rows) {
            if(err) {
                res.status(400).json(err);
                return;
            }
            if(rows.length == 0) {
                res.status(404).json('Post not found');
                return;
            }

            res.json(rows[0]);
        });
    }

    getPostCategories(id, res) {
        const sql = 'SELECT * FROM posts WHERE id=?';

        mysql.query(sql, id, function(err, rows) {
            if(err) {
                res.status(400).json(err);
                return;
            }
            if(rows.length == 0) {
                res.status(404).json('Post not found');
                return;
            }

            res.json(rows[0].categories);
        });
    }

    changePost(id, login, roles, post, res) {
        let sqlPost = {
            title: post.title,
            content: post.content,
            categories: JSON.stringify(post.categories),
            status: post.status,
            date: new Date().toJSON().slice(0, 19).replace('T', ' ')
        }
        
        mysql.query(`SELECT * FROM posts WHERE id="${id}"`, function(err, rows) {
            if(err) {
                res.status(400).json(err);
                return;
            }

            if(login != rows[0].owner && roles != 'admin') {
                res.status(400).json('not avalible');
                return;
            }
            if(roles == 'admin' && rows[0].owner != 'admin') {
                sqlPost = {
                    status: post.status,
                    date: new Date().toJSON().slice(0, 19).replace('T', ' ')
                }
            }
            const sql = `UPDATE posts SET ? WHERE id="${id}"`
        
            mysql.query(sql, sqlPost, function (err, result, rows) {
                if (err) {
                    res.status(400).json(err);
                    return;
                }
                res.json("Success");
            });
        });
    }

    deletePost(id, login, roles, res) {
        mysql.query(`SELECT * FROM posts WHERE id="${id}"`, function(err, rows) {
            if(err) {
                res.status(400).json(err);
                return;
            }

            if(rows.length == 0) {
                res.status(400).json('post already delete');
                return;
            }

            if(login != rows[0].owner && roles != 'admin') {
                res.status(400).json('not avalible');
                return;
            }
            const sql = `DELETE FROM posts WHERE id="${id}"`
        
            mysql.query(sql, function (err, result, rows) {
                if (err) {
                    res.status(400).json(err);
                    return;
                }
                res.json("Success");
            });
        })
    }
}

module.exports = new Post();