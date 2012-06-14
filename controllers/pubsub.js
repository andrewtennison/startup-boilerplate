

on.connect(function(){
	// on getFriends, for each friend SUBSCRIBE to their UID

	$.sub('uid', function(data){
		on.send(data)
	})
})


// on successfully updating + saving status publish change
$.pub('uid:12345', data)


/*

pubsub internal to node, on success websocket to update browser

- user subscribes to UID
- friend publish data to UID
- sub recieves and sends by S.IO to user
- S.IO channel = 'notifications'
- data {
	type: friendUpdate,
	data: user = {id:123, status:{}}
}

*/

io.sockets.on('connection', function (socket) { // handler for incoming connections
	socket.on('chat', function (data) {
		var msg = JSON.parse(data);
		var reply = JSON.stringify({action: 'message', user: msg.user, msg: msg.msg });
		socket.emit('chat', reply);
	socket.broadcast.emit('chat', reply);
});

socket.on('join', function(data) {
var msg = JSON.parse(data);
var reply = JSON.stringify({action: 'control', user: msg.user, msg: ' joined the channel' });
socket.emit('chat', reply);
socket.broadcast.emit('chat', reply);
});
});