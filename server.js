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
