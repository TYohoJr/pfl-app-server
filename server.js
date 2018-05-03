// All sensitive API info are stored as environment variables

var express = require("express");
var app = express();
var path = require('path')
require('dotenv').config();
const bodyParser = require('body-parser');
// Use request module to make API calls
var request = require('request');

// The production build of the front-end lives in the "build" folder
app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Server will listen on the PORT that is currently available
app.listen(process.env.PORT, () => {
    console.log(`listening on port: ${process.env.PORT}`)
})

// Send index.html on load of the page
app.get("/", (req, res) => {
    res.sendFile("index.html")
})

// Receive list of products from the API
app.post("/getProducts", (req, res) => {
    request(
        {
            url: `https://testapi.pfl.com/products?apikey=${process.env.API_KEY}`,
            headers: {
                "Authorization": `Basic ${process.env.AUTH_KEY}`
            },
            json: true
        },
        function (error, response, body) {
            // Send all the products back to the front-end
            res.json({
                body: body
            })
        }
    );
})

// Create an order
app.post("/createOrder", (req, res) => {
    // Simplify data structure
    let user = req.body.userDetails;
    // Set the payload object with all the details of the order
    let data = {
        "OrderNumber": null,
        "PartnerOrderReference": "P196334",
        "OrderCustomer": {
            "FirstName": user.firstName,
            "LastName": user.lastName,
            "CompanyName": user.companyName,
            "Address1": user.addressOne,
            "Address2": user.addressTwo,
            "City": user.city,
            "State": user.userState,
            "PostalCode": user.postalCode,
            "CountryCode": user.countryCode,
            "Email": user.email,
            "Phone": user.phone
        },
        "items": req.body.orderProductInfo,
        "Shipments": [
            {
                "ShipmentSequenceNumber": 1,
                "FirstName": user.firstName,
                "LastName": user.lastName,
                "CompanyName": user.companyName,
                "Address1": user.addressOne,
                "Address2": user.addressTwo,
                "City": user.city,
                "State": user.userState,
                "PostalCode": user.postalCode,
                "CountryCode": user.countryCode,
                "Phone": user.phone,
                "ShippingMethod": "FDXG"
            }
        ]
    }
    // Send the order to the API
    request(
        {
            json: true,
            url: `https://testapi.pfl.com/orders?apikey=${process.env.API_KEY}`,
            method: "post",
            headers: {
                "Authorization": `Basic ${process.env.AUTH_KEY}`
            },
            body: data
        },
        function (error, response, body) {
            // Send the order info or errors back to the front-end
            res.json({
                body: body
            })
        }
    );
})
