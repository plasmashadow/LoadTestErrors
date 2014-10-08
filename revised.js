
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
   socket.on('connect',function(){
	      if(!first)
	      {
		      first=true;
		      frs=parseInt(new Date().getTime());
		     // console.log(typeof frs);
		  }
	      //console.log("simulating a new client");
	      socket.emit('load',{"token":count++,"time":new Date().getTime()});
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
  console.log("-----------------------------------------------------------");
  console.log("| Socket Id          |   Average Times  | No of Messages   ");
  console.log("-----------------------------------------------------------");
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
		console.log(""+key +"       "+Math.floor(value)+"              "+messagehash[key]);
  console.log("---------------------------------------------------------------------");
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
   console.log("  "+key+"   |"+"           "+messagehash[key]+"    ");
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
function printAlldata()
{
   var len=getMaxNumber();
   out.write("Socket ID           Connect-Response       ");
   for(var i=0;i<len;i++)
   {
	 out.write("Message"+i+"       ");
   }
   out.write("\n");
   for(var key in sockethash)
   	{
		process.stdout.write(key+"              "+timehash[key]+"           ");
		var list=sockofsock[key];
		for(var element in list)
		  {
			process.stdout.write(list[element]+"            "); 
		  }
		process.stdout.write("\n");	
	}
}

function printmessagetimes()
{
  console.log("------------------------------------------");
  console.log("|  Socket ID        |   No.of.Messages   |");
  console.log("------------------------------------------");
  for(var key in sockhash)
  {
  console.log("   "+sockofsock[key]+ "      |      "+sockofsock[key].length+"      "); 
  }
}
var total=parseInt(process.argv[2]);
for(var i=1;i<=total;i++)
{
Kick();
}
console.log("-------------------------------------------------");
console.log("|    No of beats      |  total request server  |");
console.log("-------------------------------------------------");

setInterval(function(){
	 var temp=Object.keys(sockethash).length;
	// console.log(Object.keys(timehash).length);
	 ++seconds;
	 if(temp>=total)
	 {
	    console.log("End the simulation....");
	    console.log((lrt-frs)/1000+" seconds");	
	    printTestInfo();
	    printaveragetimes();
	  //  console.log(sockofsock);
	    //printAlldata();
	    printMessageHash();
	    process.exit(1); 
	 }
console.log("       "+seconds+"              |"+"       "+temp+"      ");
console.log("-------------------------------------------------");
	},1000);
