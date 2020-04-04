const connection = require('../connections/mysql_db');

exports.findUser = (email) => {
	const query = {
		sql: 'SELECT * FROM users WHERE email=?',
		values: [email],
	}

	return new Promise((resolve, reject) => {
		connection.query(query, (err, result) => {
			console.log(result);
			if(err) reject(err);
			else resolve(result);
		})
	})
	
}

exports.findUserViaId = (userId) => {
	const query = {
		sql: 'SELECT * FROM users WHERE userId=?',
		values: [userId],
	}

	return new Promise((resolve, reject) => {
		connection.query(query, (err, result) => {
			if(err) reject(err);
			else resolve(result);
		})
	})
	
}

exports.createUser = (email, password, firstName, lastName) => {
	const query = {
		sql: 'INSERT into users(email,password,firstName,lastName) values(?,?,?,?)',
		values: [email, password, firstName, lastName]
	}

	return new Promise((resolve, reject) => {
		connection.query(query, (err, result) => {
			if(err) reject(err);
			else resolve(result.insertId);
		})
	})
	
		
}

exports.setEmailVerified = (user_id) => {
	const query = {
		sql: 'UPDATE users SET is_verified = true where userId = ?',
		values: [user_id]
	}

	return new Promise((resolve, reject) => {
		connection.query(query, (err, result) => {
			if(err) reject(err);
			else resolve();
		})
	})
	
}

exports.resetPassword = (user_id, newPassword) => {
	const query = {
		sql: 'UPDATE users SET password=? where userId= ?',
		values: [newPassword, user_id]
	}

	return new Promise((resolve, reject) => {
		connection.query(query, (err, result) => {
			if(err) reject(err);
			else resolve();
		})
	})
	
}