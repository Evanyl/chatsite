let express = require('express');
let app = express();
let server = require('http').createServer(app);

let io = require('socket.io').listen(server);
let users = [];
let connections = [];

server.listen(process.env.PORT || 3000);
console.log('Server running');

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', socket => {
	connections.push(socket);
	console.log('Connected: %s sockets conected', connections.length);

	// Disconnect
	socket.on('disconnect', data => {
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets connected', connections.length);
		io.sockets.emit('alert disconnected user', socket.username);
	});

	// Send Message

	socket.on('send message', data => {
		io.sockets.emit('new message', {msg: data, user: socket.username});
	})

	// New User

	socket.on('new user', (data, callback) => {
		callback = true;
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
		io.sockets.emit('alert new user', socket.username);
	})

	// Send heart

	socket.on('send heart', data => {
		io.sockets.emit('display heart', data);
	});

	let updateUsernames = () => {
		io.sockets.emit('get users', users);
	}
});