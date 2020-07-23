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
	});

	// Send Message

	socket.on('send message', data => {
		console.log(data);
		io.sockets.emit('new message', {msg: data, user: socket.username});
	})

	// New User

	socket.on('new user', (data, callback) => {
		callback = true;
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	})

	let updateUsernames = () => {
		io.sockets.emit('get users', users);
	}
});