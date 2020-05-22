const express = require('express');
const app = express();

const server_port = process.env.PORT || 80;
const server_host = process.env.HOST;

// app.listen(server_port, server_host, (err) => {
// 	if(err) {
// 		return console.log(`something wrong`, err)
// 	}
// 	console.log(`Server is listening port on ${server_port}`)
// })

