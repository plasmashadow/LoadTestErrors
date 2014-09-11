LoadTestErrors
==============

errors encountered at load test..

I have modified some code on the server to prompt the number of users connected at the time.

```
var counter=0;
io.on('connection', function(socket){
  winston.info('User connected');
  console.log("user connected "+ ++counter+" from "+socket.id);
  
```

and then i tried to connect the server sockets with above script.


```
=======poster.js==========
function SocketConnection()
{  
   this.socketlist=[];
   this.connectUntil=function(number)
    {
      var that=this;
      for(var i=0;i<=number;i++)
      {
         var socket = require('socket.io-client')('http://localhost:8081',{forceNew:true});
         socket.on('connect',function(){
              console.log("new socket request..");
              that.socketlist.push(socket);
         });
      }
   }
}
============================
========test2.js============

var con=require('./poster.js');

var connection=new con.SocketConnection;

connection.connectUntil(1000);

============================

```

But server is responding or oly 250-350 request after that its hanging up...
