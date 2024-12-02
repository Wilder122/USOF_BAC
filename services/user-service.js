class UserService {
    userDto(rows) {
        let userArr = [];

        rows.forEach((element, i) => {
            userArr[i] = {
                id: element.id,
                login: element.login,
                fullName: element.fullName,
                profilePicture: element.profilePicture,
                rating: element.rating,
                roles: element.roles,
                email: element.email
            };
        });

        return userArr;
    }
}

module.exports = new UserService();