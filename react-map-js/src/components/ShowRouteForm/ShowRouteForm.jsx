import { TextField } from '@mui/material'
// import InputLabel from '@mui/material/InputLabel';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
import React, { useState, useEffect } from 'react'
// import MyButton from '../UI/button/MyButton'
import MyButton from '../UI/button/MyButton'


import classes from './ShowRouteForm.module.css'
import Autocomplete from "@mui/material/Autocomplete";
import { getHumansData } from "../../api/humans/GetHumansData";
// import { valueToPercent } from '@mui/base';

const ShowRouteForm = ({ setVisible, ordersIdForRoutes, addRoute, addOrderMarker, fuelUsage, setFuelUsage, ourStart, setOurStart, ourEnd, setOurEnd, setRouteData, routeData, ordersAddresses, setOrdersAddresses ,ordersAddressesFlag,setOrdersAddressesFlag}) => {

    // let [manufacturer, setManufacturer] = useState({});
    // let [client, setClient] = useState({});



    

    const [ourShipmentAddress, setOurShipmentAddress] = useState(null);
    const [ourDeliveryAddress, setOurDeliveryAddress] = useState(null);

    let [clients, setClients] = useState([]);
    // let [manufacturers, setManufacturers] = useState([]);
    
    // let shipmentAddresses = [];
    // let deliveryAddresses = [];

    let [ourShipmentAddresses, setOurShipmentAddresses] = useState([{city:null, street:null, building:null}])
    let [ourDeliveryAddresses, setOurDeliveryAddresses] = useState([{city:null, street:null, building:null}])

    useEffect(() => {
        

        // getHumansData("manufacturer").then((data) => {
        //     // setManufacturers(data)
        //     console.log(data)
        // })
        // getHumansData("client").then((data) => {
        //     setClients(data)
        //     console.log(data)
        // })
        setOurShipmentAddress(ourShipmentAddresses[1])
        setOurDeliveryAddress(ourDeliveryAddresses[1])
        
        // ordersAddresses.map((address) => {
        //     // if (shipmentAddresses.length!==0){
        //         // setShipmentAddresses( address.shipmentAddress)
        //     // }
        //     // if(deliveryAddresses.length!== 0 ){
        //         // setDeliveryAddresses(address.deliveryAddress)
        //     // }
        //     shipmentAddresses.push(address.shipmentAddress)
        //     deliveryAddresses.push(address.deliveryAddress)
        //      return null
        // })
        
        console.log("ordersAddresses", ordersAddresses)
        console.log("ourShipmentAddresses", ourShipmentAddresses)
        console.log("ourDeliveryAddresses", ourDeliveryAddresses)

    }, [ordersAddresses]);

    

    ordersAddresses.map((address) => {
        // if (shipmentAddresses.length!==0){
            // setShipmentAddresses(address.shipmentAddress)
        // }
        // if(deliveryAddresses.length!== 0 ){
            // setDeliveryAddresses( address.deliveryAddress)
        // }
        ourShipmentAddresses.push(address.shipmentAddress)
        ourDeliveryAddresses.push(address.deliveryAddress)
        
    })
    


    const shipmentAddressesInputProps = {
        options: ourShipmentAddresses,
        getOptionLabel: (option) => `${option.city}, ${option.street} ${option.building}  `,
    }

    const deliveryAddressesInputProps = {
        options: ourDeliveryAddresses,
        getOptionLabel: (option) => `${option.city}, ${option.street} ${option.building}  `,
    }


    // const manufacturersInputProps = {
    //     options: manufacturers,
    //     getOptionLabel: (option) => `${option.manufacturerUsername}, ${option.Addresses[0].city}, ${option.Addresses[0].street} ${option.Addresses[0].building}  `,
    // }


    // const clientsInputProps = {
    //     options: clients,
    //     getOptionLabel: (option) => `${option.clientUsername}, ${option.Addresses[0].city}, ${option.Addresses[0].street} ${option.Addresses[0].building}  `,
    // }






    function showRoute() {


        console.log("ordersIdForRoutes", ordersIdForRoutes)
        console.log("ordersAddresses", ordersAddresses)


        setVisible(false);
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        // window.scrollBy({
        //     top: 1000,
        //     left: 270,
        //     behavior: 'smooth'
        // });

        console.log("orders id in  map request", ordersIdForRoutes)

        let sendOrdersIdForRoutesData = {
            orderIds: [
                ...ordersIdForRoutes
            ],

            // start: [ourStart.lon, ourStart.lat],
            // end: [ourEnd.lon, ourEnd.lat],
            fuelusage: fuelUsage
        }
        if (ourStart !== null) {
            sendOrdersIdForRoutesData.start = [ourStart.lon, ourStart.lat]
        }
        if (ourEnd !== null) {
            sendOrdersIdForRoutesData.end = [ourEnd.lon, ourEnd.lat]
        }



        console.log(sendOrdersIdForRoutesData)
        if (sendOrdersIdForRoutesData.orderIds.length !== 0) {
            fetch('http://localhost:8081/api/v1/routing/orders', {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sendOrdersIdForRoutesData),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);


                    addRoute(data);
                    setRouteData(data.features[0].properties.summary);
                    console.log(routeData)
                    // removeStartMarker();
                    // removeEndMarker();
                    // coordinatesData.coordinates.map((c)=>addOrderMarker(c[1],c[0]))
                    const dataOrders = data.features[0].properties.summary.orders[2][0];
                    console.log(dataOrders.shipmentAddress.lat, dataOrders.shipmentAddress.lon)

                    addOrderMarker(dataOrders.shipmentAddress.lat, dataOrders.shipmentAddress.lon,
                        `<b style="color:green">Start</b><br />
                        <b>${dataOrders?.Manufacturer.name}</b><br />
                                      AddressId:${dataOrders?.shipmentAddress.addressId}<br /> 
                                      City:     ${dataOrders?.shipmentAddress.city}<br /> 
                                      Street: ${dataOrders?.shipmentAddress.street}<br />
                                     Building: ${dataOrders?.shipmentAddress.building}<br />
                                      Flat: ${dataOrders?.shipmentAddress.flat}<br />       
                        `, "Start");


                    addOrderMarker(dataOrders.deliveryAddress.lat, dataOrders.deliveryAddress.lon,
                        `<b style="color:red">End</b><br />
                                <b>           ${dataOrders?.Client.name}</b><br />
                                          AddressId:${dataOrders?.deliveryAddress?.addressId}<br /> 
                                          City:     ${dataOrders?.deliveryAddress?.city}<br /> 
                                          Street: ${dataOrders?.deliveryAddress?.street}<br />
                                          Building: ${dataOrders?.deliveryAddress?.building}<br />
                                          Flat: ${dataOrders?.deliveryAddress?.flat}<br />       
                            `, "End");

                    //    addOrderMarker(ourStart.lat, ourStart.lon, `<b style="color:green">Start</b><br />`, "Start"); 

                    console.log(dataOrders)
                    data.features[0].properties.summary.orders[2].slice(1).forEach(
                        (o) => {
                            addOrderMarker(o.deliveryAddress.lat, o.deliveryAddress.lon,
                                `<b style="color:blue">Client</b><br />
                                <b>${o.Client?.name}</b><br />
                                 AddressId:${o.deliveryAddress?.addressId}<br /> 
                                 City:     ${o.deliveryAddress?.city}<br /> 
                                 Street: ${o.deliveryAddress?.street}<br />
                                 Building: ${o.deliveryAddress?.building}<br />
                                 Flat: ${o.deliveryAddress?.flat}<br /> 
                                  `,
                                "Client"
                            )

                            // addOrderMarker(o.shipmentAddress.lat, o.shipmentAddress.lon,
                            //     `<b style="color:orange">Manufacturer</b><br />
                            //     <b>${o.Manufacturer.name}</b><br />
                            //      AddressId:${o.shipmentAddress.addressId}<br /> 
                            //      City:     ${o.shipmentAddress.city}<br /> 
                            //      Street: ${o.shipmentAddress.street}<br />
                            //      Building: ${o.shipmentAddress.building}<br />
                            //      Flat: ${o.shipmentAddress.flat}<br /> 
                            //       `,
                            //     "Manufacturer"
                            // )
                            console.log(o.orderId)
                        }
                    )
                    // addOrderMarker(ourStart.lat, ourStart.lon, `<b style="color:green">Start</b><br />`, "Start");
                    // addOrderMarker(ourEnd.lat, ourEnd.lon, `<b style="color:red">End</b><br />`, "End");

                    // data.coordinates.map((c)=>addOrderMarker(c[1],c[0]))

                    // addStartMarker(coordinatesData.coordinates[0][1], coordinatesData.coordinates[0][0]);
                    // addEndMarker(coordinatesData.coordinates[1][1], coordinatesData.coordinates[1][0]);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

            return (
                null
            )
        }
        else {
            window.scrollTo({
                top: 1000,
                behavior: "smooth"
            });
            alert("plz select a order/orders")
            return (null)
        }
    }


    function ShowrouteButton() {
        return (
            <div >
                <MyButton
                    onClick={showRoute}
                >
                    Finally Show Route
                </MyButton>
                {/* <button onClick={showRoute} >Show Route</button> */}
            </div>
        )
    }







    return (
        <div className={classes.formContainer} >

            <TextField
                onChange={e => setFuelUsage(e.target.value)}
                value={fuelUsage}
                required
                id="outlined-required"
                label={`CarFuel_Usage`}
            />

            {/* <select value={value} onChange={handleChange}>
                {options1.map((option) => (
                    <option value={option.manufacturerUsername}>{option.manufacturerUsername}</option>
                ))}
            </select> */}
            {/* shipmentAddressesInputProps */}

            <Autocomplete
                {...shipmentAddressesInputProps}
                id="shipmentAddresses-autocomplete"
                value={ourShipmentAddress}
                onChange={(event, newShipmentAddress) => {
                    setOurShipmentAddress(newShipmentAddress);
                    
                    //  setManufacturer(newShipmentAddress);
                     setOurStart({ lat: newShipmentAddress.lat, lon: newShipmentAddress.lon })
                    // setOurStart({...ourStart, lat:newManufacturer.Addresses.lat})
                    // setOurStart({...ourStart, lon:newManufacturer.Addresses.lon})
                    // console.log("start",ourStart)
                }}
                renderInput={(params) => (
                    <TextField {...params} label="Choose Start" variant="standard" />
                )}
            />
             <Autocomplete
                {...deliveryAddressesInputProps}
                id="deliveryAddresses-autocomplete"
                value={ourDeliveryAddress}
                onChange={(event, newDeliveryAddress) => {
                    setOurDeliveryAddress(newDeliveryAddress);
                    
                    //  setManufacturer(newShipmentAddress);
                     setOurEnd({ lat: newDeliveryAddress.lat, lon: newDeliveryAddress.lon })
                    // setOurStart({...ourStart, lat:newManufacturer.Addresses.lat})
                    // setOurStart({...ourStart, lon:newManufacturer.Addresses.lon})
                    // console.log("start",ourStart)
                }}
                renderInput={(params) => (
                    <TextField {...params} label="Choose End" variant="standard" />
                )}
            />



            {/* <Autocomplete
                {...manufacturersInputProps}
                id="manufacturer-autocomplete"
                //  value={manufacturer}
                onChange={(event, newManufacturer) => {

                    setManufacturer(newManufacturer);
                    setOurStart({ lat: newManufacturer.Addresses[0].lat, lon: newManufacturer.Addresses[0].lon })
                    // setOurStart({...ourStart, lat:newManufacturer.Addresses.lat})
                    // setOurStart({...ourStart, lon:newManufacturer.Addresses.lon})
                    // console.log("start",ourStart)
                }}
                renderInput={(params) => (
                    <TextField {...params} label="Choose Start" variant="standard" />
                )}
            /> */}


            {/* <Autocomplete
                {...clientsInputProps}
                id="client-autocomplete"
                //   value={client}
                onChange={(event, newClient) => {
                    setClient(newClient);
                    console.log(newClient)
                    setOurEnd({ lat: newClient.Addresses[0].lat, lon: newClient.Addresses[0].lon })
                    // setEnd({lat: newClient.Addresses.lat,lon: newClient.Addresses.lon}})
                    // setEnd({lat: newClient.Addresses.lat})
                    // setEnd({lon: newClient.Addresses.lon})
                    console.log("end", ourEnd)
                }}
                renderInput={(params) => (
                    <TextField {...params} label="Choose End" variant="standard" />
                )}
            /> */}



            {/* <TextField
                onChange={e => setStart({ ...start, lat: e.target.value })}
                value={start.lat}
                required
                id="outlined-required"
                type="number"
                label={`start lat`}
            />

            <TextField
                onChange={e => setStart({ ...start, lon: e.target.value })}
                value={start.lon}
                required
                id="outlined-required"
                type="number"
                label={`start lon`}
            /> */}

            {/* <TextField
                onChange={e => setEnd({ ...end, lat: e.target.value })}
                value={end.lat}
                required
                id="outlined-required"
                type="number"
                label={`end lat`}
            />

            <TextField
                onChange={e => setEnd({ ...end, lon: e.target.value })}
                value={end.lon}
                required
                id="outlined-required"
                type="number"
                label={`end lon`}
            /> */}

            {/* <button>hello</button> */}
            <ShowrouteButton />

        </div>
    )
}

export default ShowRouteForm