var mysql = require('mysql');

// connecting to mysql server

var connection = mysql.createConnection({
    host     : process.env.mysql_host,
    port     : process.env.mysql_port,
    user     : process.env.mysql_user,
    password : process.env.mysql_password,
    database : process.env.mysql_database,
  });

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected to database!");
});

module.exports = connection;