var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var models = require('./models');
var Message = models.Message;
var mongoose = require('mongoose');
var swig = require('swig');

//set up swig as render engine
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

app.get('/', function(req, res){
  var messages = Message.find(function(err,messages){
  	 //console.log(messages);
     res.render('index',{messages:messages});
  });


});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
  	var message = new Message({ body: msg });
  	message.save(function(err){
  		if(err) console.log(err);
  		else
			io.emit('chat message', msg);
  	});
    
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
