/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
	pgm.createTable('users', {
		id: {
			type: "VARCHAR(15)",
			primaryKey: true
		},
		username: {
			type: "VARCHAR(100)",
			notNull: true
		},
		password: {
			type: "VARCHAR(100)",
			notNull: true
		},
		fullname: {
			type: "TEXT",
			notNull: true
		},
		email: {
			type: "TEXT",
			notNull: true
		},
		role_id: {
			type: "VARCHAR(4)",
			references: "roles(id)",
			onDelete: 'CASCADE'
		},
		created_at: {
			type: "TEXT",
			notNull: true
		},
		updated_at: {
			type: "TEXT",
			notNull: true
		}
	})
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
	pgm.dropTable('users')
};
