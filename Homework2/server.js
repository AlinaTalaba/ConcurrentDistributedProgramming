const urlVar = require('url');
const http = require('http');
const hostname = '127.0.0.1';
const port = '8080';

var products = [
    {
        "id":1,
        "name": "toothpaste",
        "quantity": 10,
        "price": 5,
        "totalAmount": 500
    },
    {
        "id":2,
        "name": "Shampoo",
        "quantity": 1,
        "price":11,
        "totalAmount":11
    },
    {
        "id":3,
        "name": "toothbrush",
        "quantity": 4,
        "price":5,
        "totalAmount":20
    }
];

const server = http.createServer((req,res)=>{
    var url = urlVar.parse(req.url, true);
    console.log(url.query);
    if(url.pathname == '/products'){
        console.log(req.method);
        switch(req.method){
            case 'GET':
                console.log("GET Request:" + req.method + ' Endpoint:'+url.pathname);
                res.statusCode = 200;
                res.setHeader('Context-Type', 'application/json');
                res.end(JSON.stringify(products));
                break;
            case 'POST':
                console.log("POST Request:" + req.method + ' Endpoint:'+url.pathname);
                var body = '';
                req.on('data', function(chunckOfData){
                    body += chunckOfData;
                });
                    
                req.on('end', function(){
                    var newId = getMax(products, 'id') + 1;
                    console.log('MAx id: '+ newId);
                    console.log('End body:')
                    newProduct = JSON.parse(body);
                    newProduct['id'] = newId;
                    products.push(newProduct);
                    var response = {
                        "text": "Post request is valid. New value for Id is: " + newId,
                        "products" : JSON.stringify(products)
                    };
                    res.statusCode = 201;
                    res.setHeader('Context-Type', 'application/json');
                    res.end(JSON.stringify(response));
                });
                break;
            case 'PUT':
                console.log("PUT Request:" + req.method + ' Endpoint:'+url.pathname);
                var body = '';
                req.on('data', function(chunckOfData){
                    body += chunckOfData;
                });
                    
                req.on('end', function(){
                    newArray = JSON.parse(body);
                    console.log(newArray);
                    try{
                        var hasId = getMax(newArray, 'id') > 0;
                        if(hasId){
                            products = newArray
                            res.statusCode = 204;
                            res.setHeader('Context-Type', 'text/plain');
                            res.end('No content');
                        }
                        else{
                            handleError(res, 'Invalid request. Items should contain id property');
                        }
                    }
                    catch{
                        handleError(res, 'Invalid request. Items should contain id property');
                    }
                });
                break;
            case 'DELETE':
                console.log("DELETE Request:" + req.method + ' Endpoint:'+url.pathname);
                products.length = 0;
                res.end('After deletion, products list is empty');
                break;
            }
    }else{
        if(url.pathname.split('/').length == 3  && !isNaN(url.pathname.split('/')[2])){
            var productId = url.pathname.split('/')[2];
            switch(req.method){
                case 'GET':
                    console.log("GET Request:" + req.method + " for product Id:" + productId + ' Endpoint:'+url.pathname);
                    var product = products.filter(p => p['id'] == productId);
                    res.statusCode = 200;
                    res.setHeader('Context-Type', 'application/json');
                    res.end(JSON.stringify(product));
                    break;
                case 'POST':
                    console.log("POST Request:" + req.method + ' Endpoint:'+url.pathname);
                    var body = '';
                    req.on('data', function(chunckOfData){
                        body += chunckOfData;
                    });
                        
                    req.on('end', function(){
                        var maxId = getMax(products, 'id');
                        if(productId > maxId){
                            newProduct = JSON.parse(body);
                            newProduct['id'] = productId;
                            products.push(newProduct);
                            var response = {
                                "text": "Post request is valid. New value for Id is: " + productId,
                                "products" : JSON.stringify(products)
                            };
                            res.statusCode = 201;
                            res.setHeader('Context-Type', 'application/json');
                            res.end(JSON.stringify(response));
                        }else{
                            handleError("A product with this Id already exists.");
                        }
                    });
                    break;
                case 'PUT':
                    console.log("PUT Request:" + req.method + ' Endpoint:'+url.pathname);
                    var body = '';
                    req.on('data', function(chunckOfData){
                        body += chunckOfData;
                    });
                        
                    req.on('end', function(){
                        var maxId = getMax(products, 'id');
                        var newProduct = JSON.parse(body);
                        addNewProduct = false;

                        if(productId <= maxId){
                            var alreadyPresentProduct = products.filter(p=>p['id'] == productId);
                            var index = products.indexOf(alreadyPresentProduct);
                            if(index != -1){
                                alreadyPresentProduct["name"] = newProduct["name"];
                                alreadyPresentProduct["quantity"] = newProduct["quantity"];
                                alreadyPresentProduct["price"] = newProduct["price"];
                                alreadyPresentProduct["totalAmount"] = newProduct["totalAmount"];
                                res.statusCode = 204;
                                res.setHeader('Context-Type', 'text/plain');
                                res.end('Item updated succesfully');
                            }else{
                                addNewProduct = true;
                            }
                        }

                        if((productId > maxId) || addNewProduct){
                            newProduct['id'] = productId;
                            products.push(newProduct);
                            var response = {
                                "text": "Post request is valid. New value for Id is: " + productId,
                                "products" : JSON.stringify(newProduct)
                            };
                            res.statusCode = 201;
                            res.setHeader('Context-Type', 'application/json');
                            res.end(JSON.stringify(newProduct));
                        }else{
                            handleError("A product with this Id already exists.");
                        }
                    });
                    break;
                case 'DELETE':
                    console.log("DELETE Request:" + req.method + ' Endpoint:'+url.pathname);
                    var maxId = getMax(products, 'id');
                    if(productId <= maxId){
                        var alreadyPresentProduct = products.filter(p=>p['id'] == productId);
                        var index = products.indexOf(alreadyPresentProduct);
                            if(index != -1){
                                products.remove(alreadyPresentProduct);
                                res.statusCode = 200;
                                res.setHeader('Context-Type', 'application/json');
                                res.end('Item deleted');
                            }
                            else{
                                handleError('Not found product!');
                            }
                        }
                    break;
                }
        }
}

}).listen(8080, function(){
    console.log("Server started at port 8080");
});

function getMax(array, propName) {
    var max = 0;
    for(var i=0; i<array.length; i++) {
        var item = array[i];
        if(item[propName] > max) {
            max = item[propName];
        }
    }
    return max;
}

function handleError(res, message){
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end(message);
}

