USE usof;

CREATE TABLE IF NOT EXISTS posts (
    id INT(11) AUTO_INCREMENT,
    owner VARCHAR(31) NOT NULL,
    idOwner INT(11)NOT NULL,
    title VARCHAR(255) NOT NULL,
    content VARCHAR(3000) NOT NULL,
    status VARCHAR(31) NOT NULL DEFAULT 'active',
    categories JSON NOT NULL,
    date DATETIME NOT NULL,
    rating INT(11) DEFAULT 0,
    PRIMARY KEY (id)
);
