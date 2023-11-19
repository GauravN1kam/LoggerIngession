const express = require('express')
const logger = require('./Logger/logger')
require('dotenv').config();
const routes = require('./routes/index');
const { searchData } = require('./controller/index');
const mongoose = require('mongoose');
const app = express()
const port = 3000
const os = require('os');
const cluster = require('cluster');

const numCPUs = os.cpus().length;

if(cluster.isPrimary){
        for(let i = 0; i < numCPUs; i++) {
            cluster.fork();
    }
}else {
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/view'); 
    app.get('/', (req, res) => res.render('index'));
    app.post('/', (req,res)=>{
        let LogData = req.body
        logger.log({level: LogData.level, message: LogData.message, meta:{
            resourceId: LogData.resourceId,
                timestamp: LogData.timestamp,
                traceId: LogData.traceId,
                spanId: LogData.spanId,
                commit: LogData.commit,
                metadata: LogData.metadata    
        }});
        
        res.status(200).json({
            status: 'success',
            message: 'Log added successfully'
        });
    })
    app.post('/search/', searchData);
    // app.use('/', routes);
    app.get('/search/', (req, res) => res.render('searched'));
    mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(con => console.log("DB connection successful")).catch(err => console.log(err));

    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}