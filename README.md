## About

A very, very basic [steganographic device](http://en.wikipedia.org/wiki/Steganography) for storing a payload in a (png) image.

The resulting image (with the hidden payload) should appear to the human eye the same as the original image.

For a somewhat realistic use-case, you might find it useful to watermark images.

Unless you're James Bond, then, maybe you'll find another use.

You'll find a sample original & encoded image near the bottom of this readme.

**Caveats**

* Currently, it only supports `png` files.
* I haven't tried it with binary (just ascii text), be a guinea pig, try it.
* Regarding watermarking: If the images are compresed or resized, it will lose this invisible watermark.

See future plans, near the bottom.

## Installation

Just install with NPM, it's that easy.

    npm install stegosaurus

## Basic CLI Usage

*CLI Install note* For command-line usage, you might want to install it with `sudo npm install -g stegosaurus`.  Otherwise, you'll have to run it with the full path to it. Or add it to your path.

You can always get some help out of it:

```
$ ./stegosaurus.js --help

Usage: node stegosaurus.js [options]

Options:
   -e, --encode                       [mode] Set to encode a TARGET file.
   -d, --decode                       [mode] Set to decode a TARGET file.
   -t FILE, --target FILE             [both modes] Target steganographic file
   -i FILE, --inputmessagefile FILE   [encode mode] A text file with the message to encode (used instead of -m)
   -o FILE, --outfile FILE            [encode mode] Output filename
   -m "STRING", --message "STRING"    The original file, used in decoding (will override -i input file)
   -s NUMBER, --size NUMBER           Number of bytes to decode
```

## Example CLI Usage

### Encoding

Here we use `samples/barn.png` as our source, and we encode into the contents of the file `samples/dogood.txt` (A letter from a [series written as a prank by Benjamin Franklin](http://en.wikipedia.org/wiki/Silence_Dogood))

```
$ ./stegosaurus.js -e -t samples/barn.png -i samples/dogood.txt -o out.png
File encoded as: out.png
```

### Decoding

In this version, we need to know how many bytes are in the encoded message. So I use the tool `wc` (wordcount) to see how many characters are in the text file. Which I use in my command. (If you don't specify how many characters, it will do 128 by default)

```
$ wc -c samples/dogood.txt 
3945 samples/dogood.txt
$ node stegosaurus.js -d -t out.png -s 3945
To the Author of the New-England Courant [...]
```

## Usage as Node.js module

Naturally, you can use this guy as a node module. Essentially three methods you can call.

### Methods

#### stegosaurus.encodeFile(original_png, generated_png, message_file_path, [callback(err)])

* `original_png` is the path to your source image file (in PNG format)
* `generated_png` is the path to the output file that you're generating
* `message_file_path` is the path to the message file you'll hide / use as a payload in the generated png.
* `callback` when finished encoding, returns if there was an error (as boolean)


#### stegosaurus.encodeString(original_png, generated_png, message_string, [callback(err)])

* `original_png` is the path to your source image file (in PNG format)
* `generated_png` is the path to the output file that you're generating
* `message_string` is a string to hide / use as a payload in the generated png.
* `callback` when finished encoding, returns if there was an error (as boolean)

#### stegosaurus.decode(generated_png, message_size_bytes, [callback(decoded_string)])

* `generated_png` is the path to a png with a hidden message
* `message_size_bytes` is how many bytes you want to decode from the generated png
* `callback` returns with the decoded payload as a string.


### Samples

Encoding (and then subsequently decoding) a text from a file into a PNG:

```javascript
var stego = require("stegosaurus");
var fs = require("fs");

var original_png = "samples/barn.png";		// The original png file.
var generated_png = "out.png";				// The resulting file.
var message_file = "samples/dogood.txt";	// The message we're going to use as our payload.

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
```

Encoding (and then subsequently decoding) a text from a string into a PNG:

```javascript
var stego = require("stegosaurus");
var fs = require("fs");

var original_png = "samples/barn.png";		 // The original png file.
var generated_png = "out.png";				 // The resulting file.
var message_string = "Drink more Ovaltine."; // The message we're encoding.

stego.encodeString(original_png,generated_png,message_string,function(err){
	if (err) { throw err; }
	console.log("Wrote png to: ",generated_png);

    // Now let's decode that.
	stego.decode(generated_png,message_string.length,function(payload){
		console.log("Decoded message: ",payload);
	});

});
```

## Sample Images

Original png image:

![Original image](http://i.imgur.com/hqEEEvX.png)

Image encoded with first of the Silence Dogood letters

![Image with encoding](http://i.imgur.com/y036MWu.png)

Don't be shy, check out the [fullsize original](http://i.imgur.com/hqEEEvX.png) and the [full-sized image with encoded message](http://i.imgur.com/y036MWu.png).

## Future Considerations

In the future, I'd like to expand this module to:

* Better handle binary using typed arrays
 * This was originally written in an afternoon, and I did somethings to quickly work out the algo. It could be done more efficiently, beautifully.
* Encrypt the data. (That'd be nice.)
* Obscure where the data is hidden in the image by using a pre-shared key which defines where it is. Or, compare vs. original (one or both)
* Determine size of image by packing the size of the message into the encoded message, a la, a header in the stored data.