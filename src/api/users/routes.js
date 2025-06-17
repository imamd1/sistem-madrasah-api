const express = require('express')
const route = express.Router()
const jwt_auth = require('../../middleware/jwt_auth')
const UserServices = require('./service')
const ClientError = require('../../exceptions/ClientError')
const { validateUserPayload } = require('../../validators/users')
const asyncHandler = require('../../middleware/async_handler')

// add user
route.post(
  '/users',
  asyncHandler(async (req, res) => {
    await validateUserPayload(req.body)

    const { username, password, fullname, email, role } = req.body

    const id = await new UserServices().addUser({
      username,
      password,
      fullname,
      email,
      role
    })
    return res.status(201).json({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: { id },
    })
  }),
)

route.get(
  '/users',
  jwt_auth(),
  asyncHandler(async (req, res) => {
    const { fullname } = req.query

    const { id: credentialId } = req.jwt

    await new UserServices().verifyUserRole({ credentialId })

    const users = await new UserServices().getUsers({ fullname })

    return res.status(200).json({
      status: 'success',
      message: 'Data retreived successfully',
      data: users,
    })
  }),
)

route.get(
  '/user-profiles',
  jwt_auth(),
  asyncHandler(async (req, res) => {
    const { id: credentialId } = req.jwt

    const user = await new UserServices().getUserProfilesById({ credentialId })

    res.status(200).json({
      status: 'success',
      message: 'Data berhasil ditampilkan',
      data: user,
    })
  }),
)


module.exports = route
