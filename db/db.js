const Pool = require("pg").Pool;

class DB {
	constructor() {
		this.pool = new Pool({
			connectionString: `${process.env.POSTGRESQL}`,
		});
	}

	async createDB() {
		// remove this once done testing.
		await this.pool.query(`DROP DATABASE IF EXISTS keys;`).catch((err) => {
			console.error(err);
		});

		await this.pool.query(`CREATE DATABASE keys;`).catch((err) => {
			console.error(err);
		});
	}

	async createTable() {
		await this.pool
			.query(`CREATE TABLE list (id SERIAL PRIMARY KEY, email TEXT, key TEXT);`)
			.catch((err) => {
				console.error(err);
			});
	}

	async insert(email, key) {
		await this.pool
			.query(
				`INSERT INTO list(email, key)
			VALUES ('${email}', '${key}');`
			)
			.catch((err) => {
				console.error(err);
			});
	}

	async delete(id) {
		await this.pool
			.query(`DELETE FROM list WHERE id = ${id}`)
			.catch((err) => console.error(err));
	}

	async deleteAll() {
		await this.pool.query(`DELETE FROM list`).catch((err) => {
			console.error(err);
		});
	}
	async deleteTable() {
		await this.pool.query(`DROP TABLE IF EXISTS list`).catch((err) => {
			console.error(err);
		});
	}

	async findOne(column, value) {
		switch (column) {
			case "id":
				await this.pool
					.query(`SELECT * FROM list WHERE id=${value}`)
					.then((res) => {
						if (!res.rows[0]) {
							throw new Error();
						}
					});
				break;
			case "email":
				await this.pool
					.query(`SELECT * FROM list WHERE email='${value}'`)
					.then((res) => {
						if (!res.rows[0]) {
							throw new Error();
						}
					});
				break;
			case "key":
				await this.pool
					.query(`SELECT * FROM list WHERE key='${value}'`)
					.then((res) => {
						if (!res.rows[0]) {
							throw new Error();
						}
					});
				break;
			default:
				break;
		}
	}
}

module.exports = DB;
