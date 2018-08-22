/* Connects to the socket server */
// TODO: put the host and port to config
var socket = io.connect('http://localhost:3000');

socket.on('connect', function() {
    console.log('client connected');
});

socket.on('disconnect', function(){
    console.log('client disconnected');
});