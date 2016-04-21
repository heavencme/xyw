var socket = io.connect('http://localhost');
socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});

socket.on('connect', function(){
    console.log('connect');
});
socket.on('event', function(data){
    console.log('event');
});
socket.on('disconnect', function(){
    console.log('disconnect');
});