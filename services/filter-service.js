class FilterService {
    getCategoriesSql(categories, date, adminFlag, startingLimit, maxPostOnPage) {
        let sql = {};
        if(categories && !date) {
            if((typeof categories) == 'string') {
                if(adminFlag) {
                    sql = `SELECT * FROM posts WHERE JSON_CONTAINS(categories, '"${categories}"')`;   
                }
                sql = `SELECT * FROM posts WHERE JSON_CONTAINS(categories, '"${categories}"') AND status="active"`;
            }
            else {
                let str = '["' + categories.join('","') + '"]';
                if(adminFlag) {
                    sql = `SELECT * FROM posts WHERE JSON_OVERLAPS(categories, '${str}')`;
                }  
                sql = `SELECT * FROM posts WHERE JSON_OVERLAPS(categories, '${str}') AND status="active"`;
            }
        }
        else if(categories && date) {
            let dateArr = date.split('-');
            if((typeof categories) == 'string') {
                if(adminFlag) {
                    sql = `SELECT * FROM posts WHERE JSON_CONTAINS(categories, '"${categories}"') AND (DATE(date) BETWEEN '${dateArr[0]}' AND '${dateArr[1]}')`;
                }
                sql =`SELECT * FROM posts WHERE JSON_CONTAINS(categories, '"${categories}"') AND (DATE(date) BETWEEN '${dateArr[0]}' AND '${dateArr[1]}') AND status="active"`;   
            }
            else {
                let str = '["' + categories.join('","') + '"]';
                if(adminFlag) {
                    sql = `SELECT * FROM posts WHERE JSON_OVERLAPS(categories, '${str}') AND (DATE(date) BETWEEN '${dateArr[0]}' AND '${dateArr[1]}')`;
                }
                sql = `SELECT * FROM posts WHERE JSON_OVERLAPS(categories, '${str}') AND (DATE(date) BETWEEN '${dateArr[0]}' AND '${dateArr[1]}') AND status="active"`;
            }
        }
        else if(!categories && date) {
            let dateArr = date.split('-');
            if((typeof categories) == 'string') {
                sql = `SELECT * FROM posts WHERE (DATE(date) BETWEEN '${dateArr[0]}' AND '${dateArr[1]}')`;
            }
            else {
                sql = `SELECT * FROM posts WHERE (DATE(date) BETWEEN '${dateArr[0]}' AND '${dateArr[1]}') AND status="active"`;
            }
        }
        
        return sql;
    }
}

module.exports = new FilterService();