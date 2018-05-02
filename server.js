var express = require("express");
var app = express();
var path = require('path')
require('dotenv').config();
const bodyParser = require('body-parser');
var request = require('request');

app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Server will on the PORT that is currently available
app.listen(process.env.PORT, () => {
    console.log(`listening on port: ${process.env.PORT}`)
})

// Send index.html on load of the page
app.get("/", (req, res) => {
    res.sendFile("index.html")
})

// Receive list of products from the API
app.post("/getProducts", (req, res) =>{
    request(
        {
            url : `https://testapi.pfl.com/products?apikey=${process.env.API_KEY}`,
            headers : {
                "Authorization" : `Basic ${process.env.AUTH_KEY}`
            }
        },
        function (error, response, body) {
            // Send all the products back to the front-end as a JSON object
            res.json({
                body:JSON.parse(body)
            })
        }
    );
})

// Create an order
app.post("/createOrder", (req, res) =>{
    console.log("create order ran");
    let dataObject2 = {
        "partnerOrderReference": "MyReferenceNumber",
        "orderCustomer": {  
            "firstName": "John",  
            "lastName": "Doe",  
            "companyName": "ACME",  
            "address1": "1 Acme Way",  
            "address2": "",  
            "city": "Livingston",  
            "state": "MT",  
            "postalCode": "59047",  
            "countryCode": "US",  
            "email": "jdoe@acme.com",  
            "phone": "1234567890"  
        },
        "items": [  
            {  
                "itemSequenceNumber": 1,  
                "productID": 1234,  
                "quantity": 1000,  
                "productionDays": 4,                    
                "partnerItemReference": "MyItemReferenceID",
                "itemFile": "http://www.yourdomain.com/files/printReadyArtwork1.pdf"  
            }  
        ],  
        "shipments": [  
            {  
                "shipmentSequenceNumber": 1,  
                "firstName": "John",  
                "lastName": "Doe",  
                "companyName": "ACME",  
                "address1": "1 Acme Way",  
                "address2": "",  
                "city": "Livingston",  
                "state": "MT",  
                "postalCode": "59047",  
                "countryCode": "US",  
                "phone": "1234567890",  
                "shippingMethod": "FDXG",
                "IMBSerialNumber":"004543450"
            }  
        ],
        "payments":[
            {
                "paymentMethod": "stripe",
                "paymentID": "methodid",
                "paymentAmount": 3.00
            }
        ],
        "itemShipments":[
            {
                "itemSequenceNumber": 1,
                "shipmentSequenceNumber":1
            }
        ],
        "webhooks":[
            {
                "type":"status",
                "callbackUri": "https://www.pfl.com/callback",
                "callbackHeaders": {
                    "header_field_sample1": "header_value_sample1",
                    "header_field_sample2": "header_value_sample2"
                }
            }
        ],
        "billingVariables":[
            {
                "key":   "BillingVariable1Name",
                "value": "BillingVariable1Value"
            },
            {
                "key":   "BillingVariable2Name",
                "value": "BillingVariable2Value"
            }
        ]
    }
    let dataObject3 = {
        "partnerOrderReference": "MyReferenceNumber",
        "orderCustomer": {
            "firstName": "John",
            "lastName": "Doe",
            "companyName": "ACME",
            "address1": "1 Acme Way",
            "address2": "",
            "city": "Livingston",
            "state": "MT",
            "postalCode": "59047",
            "countryCode": "US",
            "email": "jdoe@acme.com",
            "phone": "1234567890"
        },
        "orderTemplateData": {
            "TemplateDataName": "test"
        },
        "payments": [
            {
                "paymentMethod": "stripe",
                "paymentAmount": 2010.90,
                "paymentID": "tok_103R4N2eZvKYlo2Cioqjklul"     
            }
        ],
        "items": [
            {
                "itemSequenceNumber": 1,
                "productID": 12755,
                "quantity": 50,
            }
        ],
        "shipments": [
            {
                "shipmentSequenceNumber": 1,
                "firstName": "John",
                "lastName": "Doe",
                "companyName": "ACME",
                "address1": "1 Acme Way",
                "address2": "",
                "city": "Livingston",
                "state": "MT",
                "postalCode": "59047",
                "countryCode": "US",
                "phone": "1234567890",
                "shippingMethod": "FDXG"
            }
        ]
    }
    request(
        {
            url : `https://testapi.pfl.com/orders?apikey=${process.env.API_KEY}`,
            method : "post",
            headers : {
                "Authorization" : `Basic ${process.env.AUTH_KEY}`
            },
            body : dataObject3,
            json : true
        },
        function (error, response, body) {
            // Send the order info back to the front-end
            console.log(body);
            res.json({
                body:body
            })
        }
    );
})
