// initialize everything, web server, socket.io, filesystem, johnny-five
var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , five = require("johnny-five"),
  board,servo,led,sensor;

//sets up the Arduino
board = new five.Board();


// make web server listen on port 80
app.listen(80);


// handle web server
function handler (req, res) {
  fs.readFile(__dirname + '/index.html',

  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

//when there is a connection to server
io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
 
  // if board is ready
  if(board.isReady){
    // reads button-presses and passes on the data to server using the "socket.emit"-command
	var buttons = new five.Buttons([ { pin: 9 }, { pin: 8 }, { pin: 7 }, { pin: 6 } ]); 
	var num
		
		buttons[0].on("down", function(value) {
		
			socket.emit('button', { value: 0 });
		});

		buttons[1].on("down", function(value) {
		
			socket.emit('button', { value: 1 });
		});

		buttons[2].on("down", function(value) {
		
			socket.emit('button', { value: 2 });
		});

		buttons[3].on("down", function(value) {
		
		socket.emit('button', { value: 3 });
		});
  }


  //when data with the sound-tag is recieved
  socket.on('sound', function (data) {
    console.log(data);
     if(board.isReady){  
		//set up piezo
		var mic = new five.Piezo({
		pin: 3
		}); 
		//eat food
		if (data.type == 1){
			mic.play({
			song: [
			  ["G4", 1 / 4],
			  ["C5", 1 / 4], 
			],
			tempo: 100
			}); 	
		}
		//wall hit
		if (data.type == 2){
			mic.play({
			song: [
			  
			  ["C5", 1 / 4], 
			  ["B4", 1 / 4],
			  ["A#4", 1 / 4],
			  ["A4", 1 / 4],
			  ["G#4", 1 / 4],
			  ["G4", 1 / 4],
			  ["F#4", 1 / 4],
			  ["F4", 1 / 4],
			],
			tempo: 200
			}); 	
		}
		if (data.type == 3){
		
		}

	 } 
  });
});