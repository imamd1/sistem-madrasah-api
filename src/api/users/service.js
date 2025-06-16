const { nanoid } = require('nanoid')
const bcyrpt = require('bcrypt')
const InvariantError = require('../../exceptions/InvariantError.js')
const AuthenticationError = require('../../exceptions/AuthenticationError.js')
const AuthorizationError = require('../../exceptions/AuthorizationError.js')
const { Pool } = require('pg')
const NotFoundError = require('../../exceptions/NotFoundError.js')

class UserServices {
  constructor() {
    this._pool = new Pool()
  }

  async addUser({ username, password, fullname, role = 'JlYO', email}) {
    await this.verifyUsername(username)
    const id = `user-${nanoid(10)}`
    const hashedPassword = await bcyrpt.hash(password, 10)
    const created_at = new Date().toISOString()
    const isFirstLogin = false

    const query = {
      text:
        'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [
        id,
        username,
        hashedPassword,
        fullname,
        email,
        role,
        created_at,
        created_at,
      ],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan user.')
    }

    return result.rows[0].id
  }

  async verifyUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username=$1',
      values: [username],
    }

    const result = await this._pool.query(query)

    if (result.rowCount > 0) {
      throw new InvariantError('Username sudah terdaftar')
    }
  }

  async verifyUserCredentials({ username, password }) {
    const query = {
      text: `SELECT u.id, r.name AS role, u.password 
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.username = $1`,
      values: [username],
    }

    const result = await this._pool.query(query)
    

    if (!result.rowCount) {
      throw new AuthenticationError('Username atau Password yang anda masukkan salah')
    }

    const { id, role, password: hashedPassword } = result.rows[0]

    const match = await bcyrpt.compare(password, hashedPassword)

    if (!match) {
      throw new AuthenticationError('Username atau Password yang anda masukkan salah')
    }

    return { id, role }
  }

  async verifyUserRole({credentialId}) {
    const query = {
      text: 'SELECT role FROM users WHERE id=$1',
      values: [credentialId],
    }

    const result = await this._pool.query(query)

    if (
      result.rows[0].role !== 'laborant' &&
      result.rows[0].role !== 'minlab' && 
      result.rows[0].role !== 'assistant'
    ) {
      throw new AuthorizationError('Anda Tidak Memiliki Hak Akses')
    }
  }

  async getUsers({ fullname }) {
    if (fullname === undefined) {
      fullname = ''
    }

    const query = {
      text: `
      SELECT u.id, u.username, u.fullname
      FROM users u 
      WHERE u.role = 'student' AND
      LOWER(fullname) LIKE $1`,
      values: [`%${fullname.toLowerCase()}%`],
      // values: [fullname]
    }

    const result = await this._pool.query(query)

    return result.rows
  }

  async getUserProfilesById({ credentialId }) {
    const query = {
      text: `SELECT u.username, u.fullname, u.email FROM users u WHERE u.id = $1`,
      values: [credentialId],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Data tidak ditemukan')
    }

    return result.rows[0]
  }
}

module.exports = UserServices
