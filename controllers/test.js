var http = require('http');
var fs = require('fs');

/*
var server = fs.readFile( __dirname + '/../index.js', function(err, res){
    return res;
});
//var server = readFile('index.js');
console.log(server);
server.get('/form', function (req, res, cb) {
    displayForm(res);
});
*/

var server = http.createServer(function (req, res) {
    displayForm(res);
});

function displayForm(res) {
   //var dir =  app.use(express.static( __dirname + '/../views'));
    exports.index = function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': data.length
        });
        res.write(data);
        res.end();
    };
}
