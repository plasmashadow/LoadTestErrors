
var io=require('socket.io-client');
var sockethash={};
var socketlist=[];
var messagehash={};
var count;
function Kick()
{ for(var i=0;i<process.argv[2];i++)
	{
    var socket=io.connect("http://107.167.181.203:3000",{"force new connection":true,
   "transports":[
    'websocket',
    'flashsocket',
    'htmlfile',
    'xhr-polling',
    'jsonp-polling'    
   ]
   });	
   socket.on('connect',function(){
	  // console.log('connecting');
	   socket.emit("load",{token:++count,time:new Date().getTime()});
	   socket.on('response',function(data){
		   socket.testkey=data.id;
		   sockethash[data.id]=new Date().getTime()-data.time;
		   messagehash[data.id]=[];
		   socketlist.push(socket);
		    if(socketlist.length==process.argv[2])
	       {
		   console.log('count');
	        }
	   });
	  
   });
   }
}

Kick();

