const connection = require('../connections/mysql_db');

exports.findUser = async(email) => {
	const query = {
		sql: 'SELECT * FROM users WHERE email=?',
		values: [email],
	}
	connection.query(query, (err, result) => {
		console.log(result);
		if(err) throw err;
		else return result;
	})
}

exports.findUserViaId = async(userId) => {
	const query = {
		sql: 'SELECT * FROM users WHERE userId=?',
		values: [userId],
	}
	connection.query(query, (err, result) => {
		if(err) throw err;
		else return result;
	})
}

exports.createUser = async (email, password, firstName, lastName) => {
	const query = {
		sql: 'INSERT into users(email,password,firstName,lastName) values(?,?,?,?)',
		values: [email, password, firstName, lastName]
	}
	connection.query(query, (err, result) => {
		if(err) throw err;
		else return result;
	})
		
}

exports.setEmailVerified = async (user_id) => {
	const query = {
		sql: 'UPDATE users SET is_verified=true where userId= ?',
		values: [user_id]
	}
	connection.query(query, (err, result) => {
		if(err) throw err;
		else return;
	})
}

exports.resetPassword = async (user_id, newPassword) => {
	const query = {
		sql: 'UPDATE users SET password=? where userId= ?',
		values: [newPassword, user_id]
	}
	connection.query(query, (err, result) => {
		if(err) throw err;
		else return;
	})
}