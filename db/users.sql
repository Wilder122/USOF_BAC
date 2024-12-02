USE usof;

CREATE TABLE IF NOT EXISTS users (
    id INT(11) AUTO_INCREMENT,
    login VARCHAR(31) NOT NULL UNIQUE,
    pass VARCHAR(255) NOT NULL,
    fullName VARCHAR(63) NOT NULL,
    profilePicture VARCHAR(63),
    rating INT(11) NOT NULL DEFAULT 0,
    roles VARCHAR(63) NOT NULL DEFAULT 'user',
    email VARCHAR(63) NOT NULL UNIQUE,
    isActivated BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (id)
);
