/* Connects to the socket server */
// TODO: put the host and port to config
var socket = io.connect(restapi.proto + "://" + restapi.host + ":" + restapi.port);

socket.on('connect', function() {
    console.log('client connected');
});

socket.on('disconnect', function(){
    console.log('client disconnected');
});

setInterval(function() {
    socket.emit('event', { "users": "AAA", "time": new Date().getTime() });
}, 3000);

socket.on('notify', function(payload) {
    console.log('payload: ' + JSON.stringify(payload));
})