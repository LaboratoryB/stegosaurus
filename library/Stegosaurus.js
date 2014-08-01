module.exports = function() {

	var fs = require("fs");
	var PNG = require('pngjs').PNG;

	var SPACING_X = 5;
	var SPACING_Y = 5;

	var DEFAULT_OUTFILE_NAME = "out.png";

	var is_cli = false;

	// Sample options:
	/*

	var options = {
		encode: true,
		decode: false,
		target: "",
		inputmessagefile: "",
		message: "",
		size: "",
	}


	*/

	
	this.handler = function(options,callback) {

		if (options.encode) {

			// Does the target exist?

			fs.exists(options.target,function(exists){


				// See if there's an outfile.
				if (typeof options.outfile == 'undefined') {
					// Something that doesn't exist.
					options.outfile = DEFAULT_OUTFILE_NAME;
				}

				if (!options.outfile) {
					options.outfile = DEFAULT_OUTFILE_NAME;
				}

				fs.exists(options.outfile,function(outfileexists){

					// You could handle not overwriting here.
					
					// console.log("Exists? ",exists);

					if (exists) {

						// Let's pack up the message
						if (typeof options.message != 'undefined') {
							if (options.message.length > 0) {

								var message = this.packMessage(options.message);

								this.encodeImage(options.target,message,options.outfile,function(){

									cliMessage("File encoded as: " + options.outfile);
									callback(false);

								});


							} else {
								callback("Sorry, you left out the -m, message");
							}
						} else {

							// Ok, did they specify a file?
							if (typeof options.inputmessagefile != 'undefined') {
						
								fs.exists(options.target,function(messageexists){

									if (messageexists) {

										fs.readFile(options.inputmessagefile, 'utf8', function(err, data) {
											if (err) throw err;

											
											var message = this.packMessage(data);
											this.encodeImage(options.target,message,options.outfile,function(){

												cliMessage("File encoded as: " + options.outfile);
												callback(false);

											});

										}.bind(this));


									} else {

										callback("Sorry, your input message file: " + options.inputmessagefile + " does not exist.");	

									}

								}.bind(this));

							} else {
								callback("Sorry, you left out the -i (input message file) or -m (message string) argument");	
							}

						}


					} else {
						callback("Sorry the file " + options.target + " does not exist (or you forgot the -t target flag)");
					}

				}.bind(this));

			}.bind(this));

		} else if (options.decode) {

			fs.exists(options.target,function(exists){

				// console.log("Exists? ",exists);

				if (exists) {

					// Great, I think we can just decode it.
					this.decodeImage(options.target,options.size,function(message){
						callback(message);	
					});
					
				} else {
					callback("Sorry, you need to specify a target for decoding.");
				}

			}.bind(this));

		} else {
			callback("Sorry, you need to specify -e (encode) or -d (decode)");
		}

	}

	this.getCLIArguments = function(callback) {

		var opts = require("nomnom")
		.option('encode', {
			abbr: 'e',
			flag: true,
			help: '[mode] Set to encode a TARGET file.'
		})
		.option('decode', {
			abbr: 'd',
			flag: true,
			help: '[mode] Set to decode a TARGET file.'
		})
		.option('target', {
			abbr: 't',
			metavar: 'FILE',
			help: '[both modes] Target steganographic file'
		})
		.option('inputmessagefile', {
			abbr: 'i',
			metavar: 'FILE',
			help: '[encode mode] A text file with the message to encode (used instead of -m)'
		})
		.option('outfile', {
			abbr: 'o',
			metavar: 'FILE',
			help: '[encode mode] Output filename'
		})
		.option('message', {
			abbr: 'm',
			metavar: '"STRING"',
			help: 'The original file, used in decoding (will override -i input file)'
		})
		.option('size', {
			abbr: 's',
			metavar: 'NUMBER',
			help: 'Number of bytes to decode'
		})
		.parse();

		// console.log("!trace nom opts: ",opts);
		// Handle this immediately if run from command line.
		if (opts.encode || opts.decode) {

			is_cli = true;
			this.handler(opts,function(err){
				if (err) {
					cliMessage(err);
				}
			});

		}
		

	}

	var cliMessage = function(message) {

		if (is_cli) {
			console.log(message);
		}

	}

	

	var padZero = function(str) {
		for (var j = str.length + 1; j <= 8; j++) {
			str = "0" + str;
		}
		return str;
	}

	var replaceAt = function(instr, index, character) {
	    return instr.substr(0, index) + character + instr.substr(index+character.length);
	}

	this.packMessage = function(instr) {

		var buf = new Buffer(instr);
		// console.log("!trace buffer: ",buf);

		// Let's make an array of bits, based on each 
		var bitarray = [];

		for (var i = 0; i < buf.length; i++) {

			
			var binstr = buf[i].toString(2);

			binstr = padZero(binstr);

			// console.log("!trace each buf byte: ",buf[i]);
			// console.log("!trace bin str: ",binstr);

			for (var k = 0; k < 8; k++) {
				if (binstr.charAt(k) == "0") {
					bitarray.push(false);
				} else {
					bitarray.push(true);
				}
			}

			// Make it a binary string.


		}

		return bitarray;

	}

	var bitsToMesage = function(bits) {
		
		var buf = Buffer(bits.length/8);
		var byteidx = -1;

		var mybyte = [];
		for (var i = 0; i < bits.length; i++) {
			mybyte.push(bits[i]);

			if (mybyte.length == 8) {


				var binstr = "";
				for (var j = 0; j < 8; j++) {
					var usebin = "0";
					if (mybyte[j]) {
						usebin = "1";
					}
					binstr = binstr + usebin;
				}

				// Now convert that to an int.
				var asciinum = parseInt(binstr,2);

				// console.log("!trace EACH ASCII NUM: ",asciinum);

				byteidx++;
				buf[byteidx] = asciinum;

				// Clear it when done.
				mybyte = [];
			}
		}

		// console.log(buf);
		return buf.toString();

	}

	this.decodeImage = function(path,size,callback) {

		if (typeof size == 'undefined') {
			console.log("Defaulting read size to 128");
			size = 128;
		}

		// Convert size to bits.
		size = size * 8;

		fs.createReadStream(path)
			.pipe(new PNG({
				filterType: 4
			}))
			.on('parsed', function() {

				// Ok, follow the pattern through the images
				var result = [];

				for (var y = 0; y < this.height; y++) {
					for (var x = 0; x < this.width; x++) {
						if (y % SPACING_Y == 0) {
							if (x % SPACING_X == 0) {
								if (result.length < size) {

									var idx = (this.width * y + x) << 2;

									// So let's get the value.
									var blue = this.data[idx+2];

									var binstr = blue.toString(2);
									binstr = padZero(binstr);

									// console.log("!trace BLUE BINSTRING: ",binstr);
									// What's the least significant?
									var leastsig = binstr.charAt(7);
									// console.log("!trace BLUE leastsig: ",leastsig);
									
									var bitwise = false;
									if (leastsig == "1") {
										bitwise = true;
									}

									result.push(bitwise);

								}
							}
						}

						// and reduce opacity
						// this.data[idx+3] = this.data[idx+3] >> 1;
					}
				}

				var resultmessage = bitsToMesage(result);

				callback(resultmessage);

			});

	}

	this.encodeImage = function(path,message,outfile,callback) {

		fs.createReadStream(path)
			.pipe(new PNG({
				filterType: 4
			}))
			.on('parsed', function() {

				// Ok, follow the pattern through the images

				for (var y = 0; y < this.height; y++) {
					for (var x = 0; x < this.width; x++) {
						if (y % SPACING_Y == 0) {
							if (x % SPACING_X == 0) {
								if (message.length) {
									// Let's unshift one.
									var bit = message.shift();

									// console.log("!trace %d,%d --> %d",x,y,bit);

									// Now we can take that pixel, and let's get it's blue value in binary.
									
									var idx = (this.width * y + x) << 2;

									var blue = this.data[idx+2];

									var binstr = blue.toString(2);
									binstr = padZero(binstr);

									// console.log("!trace BLUE BINSTRING: ",binstr);

									// Replace that least significant bit with our shifted bit
									var usestr = "0";
									if (bit) {
										usestr = "1";
									}
									binstr = replaceAt(binstr,7,usestr);

									// console.log("!trace blue / before after: ",blue,parseInt(binstr,2));

									this.data[idx + 2] = parseInt(binstr,2);

									// invert color
									//this.data[idx] = 50; // 255 - this.data[idx];
									//this.data[idx+1] = 50; // 255 - this.data[idx+1];
									//this.data[idx+2] = 50; // 255 - this.data[idx+2];


								}
							}
						}

						// and reduce opacity
						// this.data[idx+3] = this.data[idx+3] >> 1;
					}
				}

				this.pack().pipe(fs.createWriteStream(outfile));
				callback(false);
			});

	}
	


	/*
	drawPoint
	Draws a Point.

	gm("img.png").drawPoint(x, y)

	// https://github.com/aheckmann/gm/blob/master/examples/drawing.js

	*/

	// Instantiate
	this.getCLIArguments();

}