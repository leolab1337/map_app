/**
 * Main file for server. Configures and starts server
 */
// Dev Start: npm run dev
const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require('cors');
dotenv.config();

const SequelizeUtil = require("./modules/SequelizeUtil").SequelizeUtil;

const address = require('./routes/api/v1/address');
const routing = require('./routes/api/v1/routing');

const manufacturer = require('./routes/dao/manufacturer');
const client = require('./routes/dao/client');
const address_dao = require('./routes/dao/address');

const app = express();

//middleware
app.use(cors());
app.use(bodyParser.json());

//API routing
app.use('/api/v1', address);
app.use('/api/v1', routing);

//DAO routing
app.use('/dao/manufacturer', manufacturer);
app.use('/dao/client', client);
app.use('/dao/address', address_dao);

//port for heroku/any server which uses environmental variable PORT or 8081 (a port for our localhost)
const port = process.env.PORT || 8081;
const sequelizeUtil = new SequelizeUtil();

app.listen(port, async () => {
    if(sequelizeUtil.isSequelizeConnected()){
        console.log(`Server started on port ${port} // http://localhost:${port}/api/v1`);
/*
        axios
            .post('http://localhost:8081/dao/address', {
                city: "Helsinki",
                street: "Pohjoinen Rautatiekatu",
                building: "13"
            })
            .then(res => {
                console.log("Create Success");
            })
            .catch(error => {
                console.error(error);
            })

        axios
            .get('http://localhost:8081/dao/address')
            .then(res => {
                console.log(res.data);
            })
            .catch(error => {
                console.error(error)
            })

        axios
            .put('http://localhost:8081/dao/address', {
                addressId: 2,
                city: "Vantaa",
                street: "Pohjoinen Rautatiekatu",
                building: "12"
            })
            .then(res => {
                console.log("Update Success");
            })
            .catch(error => {
                console.error(error);
            })

        axios
            .get('http://localhost:8081/dao/address/1')
            .then(res => {
                console.log(res.data);
            })
            .catch(error => {
                console.error(error);
            })

        axios
            .delete('http://localhost:8081/dao/address/1')
            .then(res => {
                console.log("Delete Success");
            })
            .catch(error => {
                console.error(error);
            })

        axios
            .get('http://localhost:8081/dao/address')
            .then(res => {
                console.log(res.data);
            })
            .catch(error => {
                console.error(error);
            })*/
    }
});