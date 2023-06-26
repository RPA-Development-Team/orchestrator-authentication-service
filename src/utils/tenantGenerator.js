exports.generateTenant = () => {
    return {
        "username": generateString(),
        "password": generateString()
    }
}

const generateString = () => {
    let minLength = 8,
        maxLength = 15,
        length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        randStr = "";
    for (var i = 0; i < length; ++i) {
        randStr += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return randStr;
}