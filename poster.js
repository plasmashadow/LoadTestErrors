
var request=require('request');
var Thread=require("webworker-threads");
function opennewsocket()
{
 
}
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


SocketConnection.prototype.startclustermessage=function()
{
   
}

module.exports.SocketConnection=SocketConnection;