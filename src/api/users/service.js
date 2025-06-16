const { nanoid } = require('nanoid')
const bcyrpt = require('bcrypt')
const InvariantError = require('../../exceptions/InvariantError.js')
const AuthenticationError = require('../../exceptions/AuthenticationError.js')
const AuthorizationError = require('../../exceptions/AuthorizationError.js')
const { Pool } = require('pg')
const NotFoundError = require('../../exceptions/NotFoundError.js')
const CollaborationService = require('../collaborations/services.js')

class UserServices {
  constructor() {
    this._pool = new Pool()
  }

  async addUser({ nim, password, fullname, role, email }) {
    await this.verifyNewNim(nim)
    const id = `user-${nanoid(10)}`
    const hashedPassword = await bcyrpt.hash(password, 10)
    const created_at = new Date().toISOString()
    const updated_at = created_at
    const isFirstLogin = false

    const query = {
      text:
        'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [
        id,
        nim,
        hashedPassword,
        fullname,
        role,
        created_at,
        updated_at,
        isFirstLogin,
        email,
      ],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan user.')
    }

    return result.rows[0].id
  }

  async verifyNewNim(nim) {
    const query = {
      text: 'SELECT nim FROM users WHERE nim=$1',
      values: [nim],
    }

    const result = await this._pool.query(query)

    if (result.rowCount > 0) {
      throw new InvariantError('NIM sudah terdaftar')
    }
  }

  async verifyUserCredentials({ nim, password }) {
    const query = {
      text: 'SELECT id, role, password FROM users WHERE nim = $1',
      values: [nim],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new AuthenticationError('NIM / Password yang anda masukkan salah')
    }

    const { id, role, password: hashedPassword } = result.rows[0]

    const match = await bcyrpt.compare(password, hashedPassword)

    if (!match) {
      throw new AuthenticationError('NIM / Password yang anda masukkan salah')
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
      SELECT u.id, u.nim, u.fullname
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
      text: `SELECT u.nim, u.fullname, u.email FROM users u WHERE u.id = $1`,
      values: [credentialId],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Data tidak ditemukan')
    }

    return result.rows[0]
  }

  async getUserSchedules({ credentialId }) {
    const query = {
      text: `SELECT 
                    sc.day, 
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'subject_name', s.subject_name,
                            'subject_class', sc.subject_class,
                            'session', ss.start_time || ' - ' || ss.end_time
                        )
                    ) AS practicums
                FROM practicum_registrations ps
                JOIN users u ON u.id = ps.student
                JOIN subject_classes sc ON sc.id = ps.practicum_class
              JOIN sessions ss ON sc.session = ss.id
                JOIN subjects s ON s.id = sc.subject_id
                WHERE u.id = $1
                GROUP BY sc.day`,
      values: [credentialId],
    }

    const result = await this._pool.query(query)

    return result.rows
  }

  async getLecturers() {
    const query = {
      text: `SELECT id, fullname FROM users WHERE role = 'lecturer'`
    }

    const result = await this._pool.query(query)

    return result.rows
  }

  async verifyRoleAccess(credentialId) {
    try {
      await this.verifyUserRole({credentialId})
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      try {
        await new CollaborationService().verifyCollaboratorByUser(credentialId)
      } catch {
        throw error
      }
    }
  }
}

module.exports = UserServices
