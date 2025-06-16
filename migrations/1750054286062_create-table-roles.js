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
  pgm.createTable('roles', {
    id: {
      type: "VARCHAR(4)",
      primaryKey: true
    },
    name: {
      type: "VARCHAR(20)",
      notNull: true
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
  pgm.dropTable('roles')
};
