var stego = require("./stegosaurus.js");
var fs = require("fs");

var original_png = "samples/barn.png";		// The original png file.
var generated_png = "out.png";				// The resulting file.
var message_file = "samples/dogood.txt";	// The message we're going to use as our payload.

/*
stego.encodeFile(original_png,generated_png,message_file,function(err){
	if (err) { throw err; }
	console.log("Wrote png to: ",generated_png);


	// How long was the message?
	fs.stat(message_file, function (err, stats) {

        // Now let's decode that.
		stego.decode(generated_png,stats.size,function(payload){
			console.log("Decoded message: ",payload);
		});

    });

});
*/

var message_string = "Drink more Ovaltine.";

stego.encodeString(original_png,generated_png,message_string,function(err){
	if (err) { throw err; }
	console.log("Wrote png to: ",generated_png);

    // Now let's decode that.
	stego.decode(generated_png,message_string.length,function(payload){
		console.log("Decoded message: ",payload);
	});

});

