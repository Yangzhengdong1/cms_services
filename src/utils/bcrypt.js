const bcrypt = require("bcrypt");

class Bcrypt {
  hashEncryption(plaintext, salt = 10) {
    return bcrypt.hashSync(plaintext, salt);
  }

  hashCompare(plaintext, hashPlaintext) {
    return bcrypt.compareSync(plaintext, hashPlaintext);
  }
}

module.exports = new Bcrypt();
