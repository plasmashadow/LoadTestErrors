
var con=require('./poster.js');

var connection=new con.SocketConnection;

connection.connectUntil(1000);
