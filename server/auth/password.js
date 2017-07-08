const bcrypt = require("bcryptjs");

exports.hashPassword = password => bcrypt.hash(password, 2);

exports.validatePassword = (receivedPw, realPw) => bcrypt.compare(receivedPw, realPw);

