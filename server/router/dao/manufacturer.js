import express from "express";
import ResponseUtil from "../../util/ResponseUtil.js";
import DaoUtil from "../../util/DaoUtil.js";
import ManufacturerService from "../../service/ManufacturerService.js";
import axios from "axios";

const router = express.Router();



const responseUtil = new ResponseUtil();
const daoUtil = new DaoUtil();
const manufacturerDAO = new ManufacturerService();
const host = process.env.API_HOST || "localhost";
const port = process.env.API_PORT || 8081;

/**
 * Create new manufacturer in the database
 * The post request must have at least username (it is primary key).
 * It is recommended also add to the request address of the manufacturer (it can be new or already registered in the database), since that information is used for creating orders.
 * In case, when address was not provided, it can be added by updating manufacturer data via put request.
 * ATTENTION: It is not possible to add manufacturer to the address via address route
 *
 * return (in response.data.result object) created manufacturer object (= all manufacturer data, witch was provided in the request object) or null if operation was not successful
 *
 * Examples of valid request objects (= request body). Examples 3 and 4 are recommended in the most situations:
 * 1. { manufacturerUsername: "john" }
 *
 * 2. { manufacturerUsername: "john",
 *      name: "John Smith"}
 *
 * 3. { manufacturerUsername: "john",
 *      name: "John Smith",
 *      addressAdd: {
 *          city: "Helsinki",
 *          street: "Pohjoinen Rautatiekatu",
 *          building: "13",
 *          flat: 23        //optional
 *      } }
 *
 * 4. { manufacturerUsername: "john",
 *      name: "John Smith",
 *      addressAdd: {
 *          city: "Helsinki",
 *          street: "Pohjoinen Rautatiekatu",
 *          building: "13",
 *          lat: 60.3453,   //optional
 *          lon: 40.1234    //optional
 *      } }
 */
router.post("/", async(req, res) => {
    const { addressAdd } = req.body;

    const manufacturerResp = await manufacturerDAO.create(req.body);

    if(!manufacturerResp || !manufacturerResp.dataValues || !addressAdd){
        responseUtil.sendResultOfQuery(res, manufacturerResp);
        return;
    }

    const manufacturer = manufacturerResp.dataValues;

    const addedAddressResp = await axios.post(`http://${host}:${port}/dao/address`, addressAdd);
    const address = addedAddressResp?.data.result;

    if(address == null){
        responseUtil.sendResultOfQuery(res, manufacturer);
        return;
    }

    await manufacturerDAO.update({manufacturerUsername: manufacturer.manufacturerUsername, addressId: address.addressId});

    responseUtil.sendResultOfQuery(res, {...manufacturer, addressAdd: address});
});

/**
 * Read data of the queried manufacturer by its username from the database
 * return (in response.data.result object) its data including all the addresses, witch the manufacturer has or null if nothing was found
 *
 * Example of the get query path:
 * http://localhost:8081/dao/manufacturer/john
 */
router.get("/:manufacturerUsername", async(req, res) => {
    const result = await manufacturerDAO.read(req.params.manufacturerUsername);
    responseUtil.sendResultOfQuery(res, result);
});

/**
 * Read data of all manufacturers registered in the database
 * return (in response.data.result array) them data including all the addresses, witch each manufacturer has or null if nothing was found
 *
 * Example of the get query path:
 * http://localhost:8081/dao/manufacturer/
 */
router.get("/", async(req, res) => {
    const result = await manufacturerDAO.readAll();
    responseUtil.sendResultOfQuery(res, result);
});

/**
 * Update existing manufacturer data in the database
 * The put request must have at least username (it is primary key) and fields, which should be updated.
 * ATTENTION: It is not possible to update manufacturer address via address route, since such path does not exist
 *
 * return (in response.data.isSuccess field) true if operation was not successful (= some rows in the database was changed) and false if not
 *
 * Examples of valid request objects (= request body). In 2. and 3. examples you can also provide lat, lon and flat(optional):
 *
 * 1. { manufacturerUsername: "john",
 *      name: "John Smith"}
 *
 * 2. { manufacturerUsername: "john",
 *      name: "John Smith",
 *      addressAdd: {
 *          city: "Helsinki",
 *          street: "Pohjoinen Rautatiekatu",
 *          building: "13"
 *      } }
 *
 * 3. { manufacturerUsername: "john",
 *      name: "John Smith",
 *      addressAdd: {       //address to be added
 *          city: "Helsinki",
 *          street: "Pohjoinen Rautatiekatu",
 *          building: "13"
 *      },
 *      manufacturerUsername: {    //address to be deleted
 *          city: "Helsinki",
 *          street: "Pohjoinen Rautatiekatu",
 *          building: "13"
 *      } }
 */
router.put("/", async(req, res) => {
    const { addressAdd } = req.body;

    let request = {...req.body};

    if (addressAdd != null) {
        const addressResp = await axios.post(`http://${host}:${port}/dao/address`, addressAdd);
        request["addressId"] = addressResp?.data.addressId;
    }

    const status = await manufacturerDAO.update(request);
    responseUtil.sendStatusOfOperation(res, status);
});

/**
 * Delete data of the queried manufacturer from the database
 * return (in response.data.isSuccess field) true if it was deleted (= affected rows count is more than 0) or false if not
 *
 * Example of the delete query path:
 * http://localhost:8081/dao/manufacturer/john
 */
router.delete("/:manufacturerUsername", async(req, res) => {
    const status = await manufacturerDAO.delete(req.params.manufacturerUsername);
    responseUtil.sendStatusOfOperation(res, status);
});

export default router;