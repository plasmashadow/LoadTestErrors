

var excel=require('msexcel-builder');
var Log=excel.createWorkbook('./','logbook.xlsx');
var io=require('socket.io-client');
var sockethash={};  //stores client number and socket number
var timehash={};   //stores socket and token id
var messagehash={};
var sockofsock={};
var count=1;
var first=false;
var frs,lrt;
var seconds=0;
var out=process.stdout;
var hitlist=[];
function getMaxNumber()
{
	var length=0;
    for(var key in sockofsock)
    {
		if(sockofsock[key].length>length)
		{
		  length=sockofsock[key].length;	
		}
	}
	return length;
}
function Kick()
{
   var socket=io("http://107.167.181.203:3000",{'force new connection':true});	
   count++;
   socket.on('connect',function(){
	   hitlist.push(socket);
	      if(!first)
	      {
		      first=true;
		      frs=parseInt(new Date().getTime());
		     // console.log(typeof frs);
		  }
	      //console.log("simulating a new client");
	      socket.emit('load',{"token":count,"time":new Date().getTime()});
	   });
   socket.on('response',function(data){
	        lrt=parseInt(new Date().getTime());
	       // console.log(frs-lrt);
	        sockethash[data.id]=data.token;
	        timehash[data.id]=new Date().getTime()-data.time;
	        sockofsock[data.id]=[];
	        //sockofsock[data.id].push(timehash[data.id]);
	        socket.emit('message',{"count":0,"time":new Date().getTime()});
	   });
	socket.on('rsmsg',function(data){
		 messagehash[data.id]=data.count;
		 sockofsock[data.id].push(new Date().getTime()-data.time);
		// console.log(sockofsock);
		 socket.emit('message',{"count":data.count,"time":new Date().getTime()});
	   });
}
function printaveragetimes()
{
  console.log("-----------------------------------------");
  console.log("| Socket Id          |   Average Times  |");
  console.log("-----------------------------------------");
  for(var key in sockofsock)
     {
	    newlist=sockofsock[key];
	    var sum=0;
	    var value=0;
	    if(newlist.length!=0)
	    {
	    for(var i=0;i<newlist.length;i++)
	    {
		 sum=sum+newlist[i];	
		}
		 value=sum/messagehash[key];
     	}
     	else
     	{
		 value=0;		
		}	 
		console.log(""+key +"       "+value);
  console.log("--------------------------------------------");
	 }
}
function printMessageHash()
{
   var len=Object.keys(sockethash).length;
   var itr=0;
   console.log("---------------------------------------------");
   console.log("|    Socket Id          |   Exchange Message|");
   console.log("---------------------------------------------");
   for (var key in messagehash)
   {
   console.log("  "+key+"   |"+"    "+messagehash[key]+"    ");
   console.log("--------------------------------------------");
   }
}
function printTestInfo()
{
   var len=Object.keys(sockethash).length;	
   var itr=0;
   console.log("--------------------------------------------------");
   console.log("|      Socket           |          Milliseconds  |");
   console.log("--------------------------------------------------");
   for(var key in sockethash)
   {
   console.log(" "+key +"  |"+"    "+timehash[key]+"    ");
   console.log("--------------------------------------------------");
   }
}
function disconnectallsocket()
{
  hitlist.forEach(function(sock){
	   sock.disconnect();
	  });	
}
function printAlldata()
{
   var len=getMaxNumber();
   console.log("SOCK ID                     CONNECT RESPONSE");
   for(var key in sockethash)
   	{
		process.stdout.write(key+"              "+timehash[key]+"           ");
		var list=sockofsock[key];
		for(var element in list)
		  {
			process.stdout.write(list[element]+","); 
		  }
		process.stdout.write("\n");	
	}
}
var total=parseInt(process.argv[2]);
for(var i=1;i<=total;i++)
{
Kick();
}
function PrintMessagehash()
{
	var messagesheet=Log.createSheet('MessageCounts',2000,2000);
	messagesheet.set(1,1,'Socket ID');
	messagesheet.set(2,1,'Count');
	var row=2;
	for(var key in sockethash)
	{
		messagesheet.set(1,row,key);
		messagesheet.set(2,row,messagehash[key]);
		++row;
	}
}
function printconnectiontimes()
{
  var sheet=Log.createSheet('Connection times',2000,2000);
  sheet.set(1,1,'SOCKET ID');
  sheet.set(2,1,'Connection-Times');
  var row=2;
  for(var key in sockethash)
  {
	   sheet.set(1,row,key);
	   sheet.set(2,row,timehash[key]);
	   ++row;
  }
}
function printAllMessageDetails()
{
  var sheet=Log.createSheet('Message times',2000,2000);	
  sheet.set(1,1,'SOCKET_ID'); 
  var std=2;
  //print coloums
  var maxcolsize=getMaxNumber();
  i=maxcolsize+1;
  for(var i=2;i<=maxcolsize+1;i++)
  {
	  sheet.set(i,1,i-1);
  }
  var row=2;
 
  for(var key in sockethash)
  {
     var newlist=sockofsock[key];
     sheet.set(1,row,key);
     for(var j=2;j<=newlist.length+2;j++)
     {
	   sheet.set(j,row,newlist[j-2]); 
	 }
	 ++row;
  }
}

setInterval(function(){
	 var temp=Object.keys(sockethash).length;
	// console.log(Object.keys(timehash).length);
	 ++seconds;
	 if(temp>=total)
	 {
	 	disconnectallsocket();
	    console.log("End the simulation....");
	    console.log((lrt-frs)/1000+" seconds");	
	    //printTestInfo();
	    //printaveragetimes();
	  //  console.log(sockofsock);
	    //printAlldata();
	   // printMessageHash();
	    PrintMessagehash();
	    printconnectiontimes();
	    printAllMessageDetails();
	   	 Log.save(function(err){process.exit(1);});
	    
	 }
	},1000);
