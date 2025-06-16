const jsonwebtoken = require('jsonwebtoken')
const AuthenticationError = require("../exceptions/AuthenticationError.js")
const ClientError = require('../exceptions/ClientError.js')
const dotenv = require('dotenv')

dotenv.config()

const jwt_auth = () => {
	return async (req, res, next) => {
		try {
			if (!req.headers.authorization) {
				throw new AuthenticationError("Token tidak valid")
			}

			const token = req.headers.authorization.split(' ')[1] // Bearer <token>
			const artifact = jsonwebtoken.verify(token, process.env.ACCESS_TOKEN)

			req.jwt = artifact
			next()
		} catch (error) {
			if (error instanceof jsonwebtoken.TokenExpiredError || error instanceof jsonwebtoken.JsonWebTokenError) {
				// Jika terjadi kesalahan terkait JWT atau autentikasi
				return res.status(401).json({
					status: "Failed",
					message: error.message || "Token Tidak Valid",
				});
			}

			return res.status(500).json({
				status: "Error",
				message: "Internal Server Error",
			})
		}
	}
}

module.exports = jwt_auth