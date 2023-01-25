const http = require('http');
const fs = require('fs')
const path = require('path');
const { unescape } = require('querystring');
var port = process.env.PORT || 8000;
var petsPath = path.join(__dirname, 'pets.json');

var handleRequest = function (req, res) {
    // Check for 'pets' route
    if(req.method === 'GET' && req.url.includes('/pets')) {
        const urlParam = unescape(req.url.slice(6));
        // Checks for request parameter for specific pet
        if (urlParam === '') {
            fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
                if (err) {
                    console.error(err.stack);
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'text/plain');
                    return res.end('Internal Server Error');
                }
                
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(petsJSON);
            });
        } else {            
            fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
                if (err) {
                    console.error(err.stack);
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'text/plain');
                    return res.end('Internal Server Error');
                }
                
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                let petsObj = JSON.parse(petsJSON);

                // Checks if request parameter is within range of JSON data
                const isNumber = /^\d+$/.test(urlParam);
                if (urlParam < 0 || urlParam > (petsObj.length -1) || isNumber) {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Not found');                    
                } else {
                    let resultObj = petsObj[urlParam];
                    let resultStr = JSON.stringify(resultObj)
                    res.end(resultStr);
                }
            });
        }
    } else if (req.method === 'POST' && req.url.includes('/pets')) {  
        const urlParam = unescape(req.url.slice(8));
        let newPetObj = createObj(urlParam);
        if (createPetValidation(newPetObj)) {
            fs.readFile(petsPath, 'utf8', function(err, petsJSON) {
                if (err) {
                    console.error(err.stack);
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'text/plain');
                    return res.end('Internal Server Error');
                }
                
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                let petsObj = JSON.parse(petsJSON);
                petsObj.push(newPetObj)
                fs.writeFile(petsPath, JSON.stringify(petsObj), function(err){
                    if (err) {
                        console.error(err.stack);
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'text/plain');
                        return res.end('Internal Server Error');
                    }
    
                    res.end(JSON.stringify(newPetObj));
                })
            });
        } else {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Bad Rquest');
        }
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not found');
    }
};

var server = http.createServer(handleRequest);

server.listen(port, function() {
    console.log("Listening on port", port);
});

function createObj(string) {
    let resultObj = {};
    let wordArr = string.split(' ');
    for (word of wordArr) {
        let index = word.indexOf('=');
        let key = word.slice(0, index);
        let value = word.slice(index +1, word.length)
        resultObj[key] = value;
    }
    return resultObj
}

function createPetValidation(obj) {
    let age = false;
    let kind = false;
    let name = false;

    for (key in obj) {
        if (key === 'age' && obj[key] != '' && !isNaN(obj[key])) {
            age = true;
        } else if (key === 'kind' && obj[key] != '') {
            kind = true;
        } else if (key === 'name' && obj[key] != '') {
            name = true;
        }
    }

    if (age && kind && name) {
        return true
    } else return false
}