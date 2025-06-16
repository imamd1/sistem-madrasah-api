const express = require("express")
const route = express.Router();
const tokenManager = require('../../utils/token')
const ClientError = require("../../exceptions/ClientError.js")
const AuthenticationService = require("./service.js");
const UserServices = require("../users/service");

route.post('/authentications', async (req, res) => {
    try {
        const { username, password } = req.body
        const {id, role} = await new UserServices().verifyUserCredentials({ username, password })

        const accessToken = await tokenManager.generateAccToken({ id, role })
        const refreshToken = await tokenManager.generateRefToken({ id, role })


        await new AuthenticationService().addRefreshToken(refreshToken)
        return res.json({
            status: 'success',
            message: 'Login Berhasil',
            data: {
                accessToken,
                refreshToken
            }
        })
    } catch (error) {
        if (error instanceof ClientError) {
            return res.status(error.statusCode).json({
                status: "fail",
                message: error.message
            })
        }
        else {
            return res.status(500).json({
                status: "error",
                message: 'Maaf, terjadi kesalahan pada server kami.',
            })
        }
    }
})

route.delete('/authentications', async (req, res) => {
    try {
        const { refreshToken } = req.body


        await new AuthenticationService().deleteRefreshToken(refreshToken)

        res.json({
            error: false,
            status: "success",
            message: "User Berhasil logout dari sistem"
        })

    } catch (error) {
        if (error instanceof ClientError) {
            res.json({
                status: "fail",
                message: error.message

            }).status(error.statusCode)
        }
        else {
            res.status(500).json({
                status: "error",
                message: 'Maaf, terjadi kesalahan pada server kami.',
            })
        }
    }
})

module.exports = route