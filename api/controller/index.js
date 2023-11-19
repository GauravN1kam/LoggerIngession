const logger = require('../Logger/logger');

const PostAllLogs =  async (req,res) =>{
    try{
        const Logdata = req.body;
        console.log(Logdata.metadata);
        const parentResourceId = Logdata.metadata ? Logdata.metadata.parentResourceId : 'N/A';
        console.log(parentResourceId);
        logger.log({level: Logdata.level,message: Logdata.message, meta:{
            resourceId: Logdata.resourceId,
            timestamp: Logdata.timestamp,
            traceId: Logdata.traceId,
            spanId: Logdata.spanId,
            commit: Logdata.commit,
            parentResourceId: parentResourceId
        }})
        
        res.status(200).json({
            status: 'success',
            message: 'All logs are saved'
        })
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

// const searchData = async (req, res) => {
//     try {
//         const query = {};

//         // Loop over all request parameters and add them to the query
//         for (const key in req.params) {
//             query[key] = req.params[key];
//         }
//         console.log(query);
//         // Perform the search
        

//         res.status(200).json({
//             status: 'success',
//             data: logs
//         });
//     } catch (err) {
//         res.status(400).json({
//             status: 'fail',
//             message: err.message
//         });
//     }
// };

const MongoClient = require('mongodb').MongoClient;

const searchData = async (req, res) => {
    try {
        const query = req.body
        const data = {}
        if(query.level !== '')
        {
            data.level = query.level
        }
        if(query.message !== '')
        {
            data.message = query.message
        }
        if(query.resourceId !== '')
        {
            data.meta.resourceId = query.resourceId
        }
        if(query.timestamp !== '')
        {
            data.meta.timestamp = query.timestamp
        }
        if(query.traceId !== '')
        {
            data.meta.traceId = query.traceId
        }
        if(query.spanId !== '')
        {
            data.meta.spanId = query.spanId
        }
        if(query.commit !== '')
        {
            data.meta.commit = query.commit
        }
        if(query.parentResourceId !== '')
        {
            data.meta.metadata.parentResourceId = query.parentResourceId
        }

        console.log(data);
        // Connect to MongoDB
        const client = await MongoClient.connect(process.env.MONGO_URI);

        // Select the database and collection
        const db = client.db('Logger');
        const collection = db.collection('logs');

        // Perform the search
        const logs = await collection.find(data).toArray();

        await client.close();

        res.status(200).send(logs);
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

module.exports = {PostAllLogs, searchData};