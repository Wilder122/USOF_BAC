USE usof;

CREATE TABLE IF NOT EXISTS comments (
    id INT(11) AUTO_INCREMENT,
    owner VARCHAR(31) NOT NULL,
    idOwner INT(11)NOT NULL,
    postId INT(11)NOT NULL,
    content VARCHAR(3000) NOT NULL,
    status VARCHAR(31) NOT NULL DEFAULT 'active',
    date DATETIME NOT NULL,
    rating INT(11) DEFAULT 0,
    PRIMARY KEY (id)
);
