const connection = require('../connections/mysql_db');

exports.findUser = async(email) => {
	const query = {
		sql: 'SELECT * FROM users WHERE email=?',
		values: [email],
	}
	const result =  await connection.query(query);
	return result;
}

exports.findUserViaId = async(userId) => {
	const query = {
		sql: 'SELECT * FROM users WHERE user_id=?',
		values: [userId],
	}
	const result =  await connection.query(query);
	return result;
}

exports.createUser = async (email, password, firstName, lastName) => {
	const query = {
		sql: 'INSERT into users(email,password,first_name,last_name) values(?,?,?,?)',
		values: [email, password, firstName, lastName]
	}
	try{
		const result = await connection.query(query)
		return result.insertId;
	}
	catch(e){
		const query = {
			sql: 'DELETE from users where email = ?',
			values: [email]
		}
		await connection.query(query)
		console.log(e)
	}	
}

exports.setEmailVerified = async (user_id) => {
	const query = {
		sql: 'UPDATE users SET is_verified=true where user_id= ?',
		values: [user_id]
	}
	await connection.query(query)
	return ;
}

exports.resetPassword = async (user_id, newPassword) => {
	const query = {
		sql: 'UPDATE users SET password=? where user_id= ?',
		values: [newPassword, user_id]
	}
	await connection.query(query)
	return ;
}