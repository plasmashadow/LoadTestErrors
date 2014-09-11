
var numusers=process.argv[3];
var simul=process.argv[4];

var http=require('http'),
    loop=require('./node_modules/nodeload/lib/loop/loop.js'),
    request=0,
    client=http.createClient(8081,'localhost'),
    itr=new loop.Loop({
    	fun:function(finished)
    	{   
    		var socket = require('socket.io-client')('http://localhost:8081',{forceNew:true});
    		socket.on('connect',function(){

    		});
    		finished();
    	},
    	rps:10,
    	duration:Infinity,
    	concurrency:1,
    	delay:0
    }).start();

itr.on('end',function(){console.log("=======The END========")});




/*
var request=require('request');
var Thread=require("webworker-threads");

var worker=Thread.Worker;

for(var i=0;i<2;i++)
{
   var temp=new worker(function(){

    this.onmessage=function(event)
    {
        console.log('hi');
        var socket = require('socket.io-client')('http://localhost:8081/',{forceNew:true});
        socket.on('connect',function(){
            console.log('opening connection.....');
            });
    }
   });
   temp.postMessage('dumm');
}
*/