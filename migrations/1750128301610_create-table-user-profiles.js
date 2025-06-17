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
  pgm.createTable("user_profiles", {
    id: {
      type: "VARCHAR(20)",
      primaryKey: true,
    },
    user_id: {
      type: "VARCHAR(15)",
      references: "users(id)",
      onDelete: "CASCADE",
    },
    nik: {
      type: "VARCHAR(20)",
      notNull: true,
    },
    alamat: {
      type: "TEXT",
      default: null
    },
    phone_number: {
      type: "NUMBER(13)",
      default: null
    },
    created_at: {
			type: "TEXT",
			notNull: true
		},
		updated_at: {
			type: "TEXT",
			notNull: true
		}
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {};
