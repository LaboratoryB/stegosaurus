// ------------------------------------------------------------------------------------------------------------------------ -
/*

 ________  _________  _______   ________  ________  ________  ________  ___  ___  ________  ___  ___  ________      
|\   ____\|\___   ___\\  ___ \ |\   ____\|\   __  \|\   ____\|\   __  \|\  \|\  \|\   __  \|\  \|\  \|\   ____\     
\ \  \___|\|___ \  \_\ \   __/|\ \  \___|\ \  \|\  \ \  \___|\ \  \|\  \ \  \\\  \ \  \|\  \ \  \\\  \ \  \___|_    
 \ \_____  \   \ \  \ \ \  \_|/_\ \  \  __\ \  \\\  \ \_____  \ \   __  \ \  \\\  \ \   _  _\ \  \\\  \ \_____  \   
  \|____|\  \   \ \  \ \ \  \_|\ \ \  \|\  \ \  \\\  \|____|\  \ \  \ \  \ \  \\\  \ \  \\  \\ \  \\\  \|____|\  \  
    ____\_\  \   \ \__\ \ \_______\ \_______\ \_______\____\_\  \ \__\ \__\ \_______\ \__\\ _\\ \_______\____\_\  \ 
   |\_________\   \|__|  \|_______|\|_______|\|_______|\_________\|__|\|__|\|_______|\|__|\|__|\|_______|\_________\
   \|_________|                                       \|_________|                                      \|_________|
                                                                                                                    

*/
// ------------------------------------------------------------------------------------------------------------------------ -
// A (quickly made) steganographic device to hide information in images.
// ------------------------------------------------------------------------------------------------------------------------ -


var constants = require("./includes/constants.js"); 		// Constants module (w/ general configs)

var Stegosaurus = require("./library/Stegosaurus.js");		// the Compiler
var stegosaurus = new Stegosaurus();

exports.encodeFile = function(infile,outfile,message,callback) {

	var sendoptions = {
		encode: true,
		decode: false,
		target: infile,
		inputmessagefile: message,
	}

	stegosaurus.handler(sendoptions,function(err){
		callback(err);
	});

}

exports.encodeString = function(infile,outfile,messagestring,callback) {

	var sendoptions = {
		encode: true,
		decode: false,
		target: infile,
		message: messagestring,
	}

	stegosaurus.handler(sendoptions,function(err){
		callback(err);
	});

}

exports.decode = function(infile,length_in_bytes,callback) {

	var sendoptions = {
		encode: false,
		decode: true,
		target: infile,
		size: length_in_bytes,
	}

	stegosaurus.handler(sendoptions,function(payload){
		callback(payload);
	});

}