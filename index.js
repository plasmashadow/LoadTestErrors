/*
Load testing for socket.io server

Modules used:
nodeload version 0.4.0
socket.io version 1.1.0

*/





/*
var numofuser=process.argv[3];

//main program.
(function(){

var loader=require('nodeload');
var loadtest=loader.run({

	host:'localhost',
	port:8081,
	timeLimit:60,
	targetRps:500,
	numUsers:numofuser,
	requestGenerator:function(client){
		 var socket = require('socket.io-client')('http://localhost:8081',{forceNew:true});
		 socket.on("connect",function(){
		 	console.log("socket connect");
		 });
		 //exporting the request model object
		 //Making a mock method for the function to work.....
		 var request=client.request('POST','http://localhost:8081/message');
		 request.end();
		 return request;
		 //this also mock end to the function...without this others work work...
	}
}).on('end',function(){console.log("end")});

*/
/*
var http = require('http');
var nl = require('nodeload');
console.log("Test server on localhost:9000.");
http.createServer(function (req, res) {
    res.writeHead((Math.random() < 0.8) ? 200 : 404, {'Content-Type': 'text/plain'});
    res.end('foo\n');
}).listen(9000);

nl.run({
    name: "Read",
    host: 'localhost',
    port: 9000,
    numUsers: 10,
    timeLimit: 600,
    targetRps: 500,
    stats: [
        'result-codes', 
        { name: 'latency', percentiles: [0.9, 0.99] },
        'concurrency',
        'rps',
        'uniques',
        { name: 'http-errors', successCodes: [200,404], log: 'http-errors.log' }
    ],
    requestGenerator: function(client) {
        return client.request('GET', "/" + Math.floor(Math.random()*8000), { 'host': 'localhost' });
    }
});
*/


})();