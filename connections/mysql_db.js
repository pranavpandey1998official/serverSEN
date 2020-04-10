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


// let query = "select * from users";
// // let query = "update users set is_verified = 1 where email = 'matajay@gmail.com'";
// connection.query(query, (e, t)=> {
//   console.log(t);
// })

module.exports = connection;