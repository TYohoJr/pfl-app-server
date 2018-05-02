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
    let user = req.body.userDetails;
    let dataObject = {
        "partnerOrderReference": "MyReferenceNumber",
        "orderCustomer": {
            "firstName": user.firstName,
            "lastName": user.lastName,
            "companyName": user.companyName,
            "address1": user.addressOne,
            "address2": user.addressTwo,
            "city": user.city,
            "state": user.userState,
            "postalCode": user.postalCode,
            "countryCode": user.countryCode,
            "email": user.email,
            "phone": user.phone
        },
        "payments": [
            {
                "paymentMethod": "stripe",
                "paymentAmount": 2010.90,
                "paymentID": "tok_103R4N2eZvKYlo2Cioqjklul"     
            }
        ],
        "items": req.body.orderDetails,
        // "items": [
        //     {
        //         "itemSequenceNumber": 1,
        //         "productID": 12755,
        //         "quantity": 50,
        //     }
        // ],
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
            body : dataObject,
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
