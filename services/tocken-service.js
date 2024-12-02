const jwt = require('jsonwebtoken');
const mysql = require('../db/db.js');

const JWT_ACCESS_SECRET = 'usof_access';
const JWT_REFRESH_SECRET = 'usof_refresh';

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {expiresIn: '6h'})
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    saveTocken(login, refreshToken) {
        const tokenSql = 'INSERT INTO tokens SET ?';

        let tokenData = {
            login: login, 
            refreshTocken: refreshToken
        }

        mysql.query(tokenSql, tokenData, function (err, rows) {
            if(err && err.errno == 1062) {
                mysql.query(`UPDATE tokens SET refreshTocken="${refreshToken}" WHERE login="${login}"`, function(err, rows) {
                    if(err) {
                        console.log(err);
                    }
                });
            }
        });
    }

    removeToken(refreshToken) {
        const sql = `DELETE FROM tokens WHERE refreshTocken="${refreshToken}"`;

        mysql.query(sql, function(err, rows) {
            if(err) {
                console.log(err);
            }
        });
    }
}

module.exports = new TokenService();