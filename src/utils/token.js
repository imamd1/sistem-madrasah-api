const jsonwebtoken = require("jsonwebtoken")
const InvariantError = require("../exceptions/InvariantError")

const TokenManager = {
    generateAccToken: (payload) => jsonwebtoken.sign(payload, process.env.ACCESS_TOKEN, {expiresIn: process.env.EXPIRED_TIME}),
    generateRefToken: (payload) => jsonwebtoken.sign(payload, process.env.REFRESH_TOKEN, {expiresIn: process.env.EXPIRED_R_TIME}),
    verifyRefToken: (refreshToken) => {
        try {
            const artifact = jsonwebtoken.decode(refreshToken)
            jsonwebtoken.verify(artifact,process.env.REFRESH_TOKEN)
            const {payload} = artifact.decoded
            return payload
        } catch (error) {
            throw new InvariantError('Refresh Token Tidak Valid')
        }
    }
}

module.exports = TokenManager