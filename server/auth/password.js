const bcrypt = require("bcryptjs");

exports.hashPassword = password => bcrypt.hash(password, 10);

exports.validatePassword = (receivedPw, realPw) => bcrypt.compare(receivedPw, realPw);

