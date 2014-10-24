var excel=require('msexcel-builder');
var Log=excel.createWorkbook('./','messagebook.xlsx');
var io=require('socket.io-client');
var socketlist=[];
var sockethash={};
var messagehash={};
var count=0;
var lastsocket;
var completedlist=[];

var out=process.stdout;
function startMessage()
{
  	socketlist.forEach(function(sock)
  	{
		//console.log(lastsocket.testkey);
		sock.emit('message',{"count":0,"time":new Date().getTime()});
		sock.on('rsmsg',function(data)
		{
		 // console.log(data);
		   if(data.count>=100)
		   {
			 //console.log(sock.testkey);
			  //do nothing
			//  console.log(sock.testkey +"                  "+messagehash[sock.testkey]);
			completedlist.push(sock);
			if(completedlist.length>=process.argv[2])
			{
			  // console.log(messagehash);
			//  PrintMessageTimes(messagehash);
			printmessage(messagehash);
			   process.exit(1);	
			}
		   }	
		   else
		   {
			  sock.emit('message',{"count":data.count,"time":new Date().getTime()});
			  messagehash[sock.testkey].push(new Date().getTime()-data.time);
		   }
		});
	});
}

function PrintMessageTimes(messagehash)
{ 
	var sheet=Log.createSheet('messages',2000,2000);
	var row=1;
	
	for(var key in sockethash)
	{
		var col=1;
		sheet.set(row++,col,key);
	  	var newlist=messagehash[key];
	  	newlist.forEach(function(element){
			   sheet.set(row,col++,element);
			});
	}
}

function printmessage(messagehash)
{
   	for(var key in sockethash)
   	{
	   out.write(key+" ");
	   var newlist=messagehash[key];
	   newlist.forEach(function(element){
		      out.write(element+",");
		   });
	   out.write("\n");
	}
}
function Kick()
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
	   //console.log('connecting');
	   socket.emit("load",{token:++count,time:new Date().getTime()});
	   socket.on('response',function(data){
		   socket.testkey=data.id;
		   sockethash[data.id]=new Date().getTime()-data.time;
		   messagehash[data.id]=[];
		   socketlist.push(socket);
		   lastsocket=socket;
	   });
	   if(socketlist.length>process.argv[2])
	   {
		   startMessage();
	   }
	   else
	   {
		   Kick();
	   }
   });
}

Kick();
