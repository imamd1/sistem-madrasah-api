const { Pool } = require('pg')

const InvariantError = require('../../exceptions/InvariantError')

class AuthenticationService {
    constructor() {
        this._pool = new Pool()
    }


    async addRefreshToken(token) {
        const query = {
            text: 'INSERT INTO authentications VALUES($1)',
            values: [token]
        }

        const result = await this._pool.query(query)

        return result;

    }

    async verifyRefreshToken(token) {
        const query = {
            text: 'SELECT token FROM authentications WHERE token=$1',
            values: [token]
        }

        const result = await this._pool.query(query)
        if (!result.rowCount) {
            throw new InvariantError('Refresh Token Tidak Valid')
        }
    }

    async deleteRefreshToken(token) {
        const query = {
            text: 'DELETE FROM authentications WHERE token=$1',
            values: [token]
        }

        await this._pool.query(query)

        
    }
}

module.exports = AuthenticationService