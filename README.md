# PFL API APP SERVER

This is the back-end code of my coding challenge for PFL. The code makes use of Express as the back-end framework, body-parser to parse through JSON objects, and the Request module to make HTTP calls to the PFL test API. The production build of the front-end code exists in the "build" folder.

### The server consists of 2 main functions

##### /getProducts

This function calls to the PFL test API upon render of the landing page to obtain a list of all currently available products that PFL has

##### /createOrder

This function recieves all the order info from the user on the fon-end, appends it into an object, and sends the data to the PFL test API. It then sends back the order info/errors to the front-end to be displayed to the user.