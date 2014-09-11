var fs=require('fs');

var contentdir=__dirname+"/test2.js";

var contents=fs.readFileSync(contentdir).toString();

eval(contents);