const exress = require('express');
const {PostAllLogs} = require('../controller');
const Router = exress.Router();

Router.post('/',PostAllLogs);

module.exports = Router;