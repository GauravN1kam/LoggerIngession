const {createLogger, transports, format} = require('winston');
const Logger = require('../DB/schema')
require('dotenv').config();

require('winston-mongodb');
const logger = createLogger({
    transports: [
        new transports.File({
            filename:'Logs/combined.log',
            level: 'silly',
            format: format.combine(format.json())
        }),
        new transports.MongoDB({
            level: 'silly',
            db: process.env.MONGO_URI,
            collection: 'logs',
            options: {
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
            metaKey: 'meta',
            format: format.combine(format.json())
        })
    ]
});

module.exports = logger;