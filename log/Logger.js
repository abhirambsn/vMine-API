const { createLogger, format, transports, config } = require('winston')

const logger = createLogger({
    transports: [
        new transports.File({
            filename: process.env.LOG_PATH
        })
    ]
})

module.exports = logger