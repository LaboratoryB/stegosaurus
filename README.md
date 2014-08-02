## About

A very, very basic [steganographic device](http://en.wikipedia.org/wiki/Steganography) for storing a payload in a (png) image.

The resulting image should be the same to the human eye.

You might find it useful to watermark images, however if the images are compresed or resized, it will lose this invisible watermark.

Unless you're James Bond, then, maybe you'll find another use.

* Currently, it only supports `png` files.
* I haven't tried it with binary, be a guinea pig, try it. (just ascii text)

## Installation

*(coming soon)*

## Usage as NPM Module



## Basic CLI Usage

You can always get some help out of it:

```
$ node stegosaurus.js --help

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
$ node stegosaurus.js -e -t samples/barn.png -i samples/dogood.txt -o out.png
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