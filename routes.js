const fs = require('fs');
const path = require('path');
var petsPath = path.join(__dirname, 'pets.json');

const routes = {
    '/pets': function(req, res) {
        console.log(req.param)
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
      },
    
}

module.exports = routes