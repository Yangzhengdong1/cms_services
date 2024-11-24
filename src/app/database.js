const mysql = require("mysql2");
const config = require("./config");


const MYSQL_CONFIG = {
  host: config.MYSQL_HOST,
  port: config.MYSQL_PORT,
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
  database: config.MYSQL_DATABASE
};

const connections = mysql.createPool(MYSQL_CONFIG);

connections.getConnection((error, connection) => {
  connection.connect(err => {
    if (err) {
      console.log("数据库连接失败！");
    } else {
      console.log("数据库连接成功~");
    }
  });
});


module.exports = connections.promise();
