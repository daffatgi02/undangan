/**
 * Standarisasi JSON Response
 * Mengikuti Antigravity API Standard
 */

const ResponseUtil = {
    success(res, data = null, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    },

    error(res, message = 'Internal Server Error', statusCode = 500) {
        return res.status(statusCode).json({
            success: false,
            message
        });
    }
};

module.exports = ResponseUtil;
