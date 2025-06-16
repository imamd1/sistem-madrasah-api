const ClientError = require("../exceptions/ClientError")


function errorHandler(err, req, res, next) {
    if (err instanceof ClientError) {
        return res.status(err.statusCode).json({
            status: "FAILED",
            message: err.message
        })
    }
    console.log(err)
    return res.status(500).json({
        error: true,
        status: "ERROR",
        message: "Terjadi Kesalahan Pada Server Kami"
    })

}

module.exports = errorHandler