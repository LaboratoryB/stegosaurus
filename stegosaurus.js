#! /usr/bin/env node
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
// Created by Doug Smith, July 2014 (dougbtv@sectivum.io)
// Licensed under the MIT license, see license.txt
// ------------------------------------------------------------------------------------------------------------------------ -
// What you're looking at is the setup, and the public methods.
// Inside library/Stegosaurus.js you'll find the logic / private methods.
// ------------------------------------------------------------------------------------------------------------------------ -


// Constants module (w/ general configs)
// Currently, not really used. But, in case I need it later.
var constants = require("./includes/constants.js"); 		

// Setup our primary library module, which we'll handle in our exports here.
var Stegosaurus = require("./library/Stegosaurus.js");
var stegosaurus = new Stegosaurus();


// Encode a PNG image, given a message file.

exports.encodeFile = function(infile,outfile,message,callback) {

	if (typeof callback == 'undefined') {
		callback = function(){};
	}

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

// Encode a PNG image, given a string.

exports.encodeString = function(infile,outfile,messagestring,callback) {

	if (typeof callback == 'undefined') {
		callback = function(){};
	}

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

// Encode a message

exports.decode = function(infile,length_in_bytes,callback) {

	if (typeof callback == 'undefined') {
		callback = function(){};
	}

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