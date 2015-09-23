var stego = require("../stegosaurus.js");
var fs = require("fs");

var original_png = "samples/barn.png";		// The original png file.
var generated_png = "cheese.png";			// The resulting file.
var message_file = "samples/dogood.txt";	// The message we're going to use as our payload.
var message_file_regexp = new RegExp(/^\s*To the Author of the New-England Courant/);
var message_string = "Drink more Ovaltine.";

/*

*/


module.exports = {
	setUp: function (callback) {
		// console.log("!trace SETUP");
		callback();
	},
	encodeAndDecodeFile: function(test) {
		stego.encodeFile(original_png,generated_png,message_file,function(err){
			if (err) { throw err; }
			
			// console.log("Wrote png to: ",generated_png);
			fs.exists(generated_png,function(exists){
				test.ok(exists, "File generates: " + generated_png);
			
				// How long was the message?
				fs.stat(message_file, function (err, stats) {

					// Now let's decode that.
					stego.decode(generated_png,stats.size,function(payload){
						// console.log("Decoded message: ",payload);
						test.ok(payload.match(message_file_regexp), "Decoded properly");
						test.done();
					});

			    });

			});

		});
		
	},
	encodeAndDecodeString: function(test) {
		stego.encodeString(original_png,generated_png,message_string,function(err){
			if (err) { throw err; }
			console.log("Wrote png to: ",generated_png);
			fs.exists(generated_png,function(exists){
				test.ok(exists, "File generates: " + generated_png);
				
				// Now let's decode that.
				stego.decode(generated_png,message_string.length,function(payload){
					test.ok(payload == message_string, "Decoded properly");
					test.done();
					// console.log("Decoded message: ",payload);
				});
				
			});


		});

	},
	tearDown: function (callback) {
		// clean up
		// console.log("!trace TEARDOWN");
		fs.unlink(generated_png, function(err){
			callback();
		});
	},
    
    /*
    waitForServer: function(test) {
    	setTimeout(function(){
			test.ok(true, "Wait for server to boot.");
			test.done();
		},500);
	},
	testMethodExists: function(test){
		test.expect(1);

		client.get('/api/foo', function(err, req, res, data) {

			if (err) {
				test.ok(false, "Restify error: " + err);
			} else {
				if (data.code != 200) {
					test.ok(true, "Test API Method, foo, exists");
				}
			}
			test.done();
		});
	},
	loginFailure: function(test){
	
		client.post('/api/login',{
			email: 'doooofer1dge',
			password: 'somethingFAKE',
		}, function(err, req, res, data) {

			var result = JSON.parse(res.body);

			if (!err) {
				test.ok(result.failed, "Login failure");
			} else {
				test.ok(false, "Restify error: " + err);
			}
			test.done();
		});
		
	},
	loginSuccessful: function(test){
		
		client.post('/api/login',{
			email: TEST_USERNAME,
			password: TEST_PASSWORD
		}, function(err, req, res, data) {

			var result = JSON.parse(res.body);
			if (!err) {
				if (!result.failed) {
					test.ok(true, "Login succeeded");
				} else {
					test.ok(false, "Expected successful login");	
				}
				
				// console.log(res.body);
			} else {
				test.ok(false, "Restify error: " + err);
			}

			test.done();

		});
		
	},
	addRelease: function(test){
	
		client.post('/api/addRelease', NEW_RELEASE, function(err, req, res, data) {

			var result = JSON.parse(res.body);

			// console.log("!trace NEW RELEASE: ",result);
			
			if (!err) {
				if (!result.error) {
					new_releaseid = result.releaseid;
					test.ok(true, "Release added");
				} else {
					test.ok(false, "New release errored out");	
				}
				// console.log(res.body);
			} else {
				test.ok(false, "Restify error: " + err);
			}
			test.done();
		});
		
	},
	editRelease: function(test){

		var edited_release = NEW_RELEASE;
		edited_release.release._id = new_releaseid;
		edited_release.release.branch_name = "edited";
		
		// console.log("!trace edited_release: ",edited_release);

		client.post('/api/editRelease', edited_release, function(err, req, res, data) {

			var result = JSON.parse(res.body);

			// console.log("!trace editRelease result: ",result);
			
			if (!err) {
				if (!result.error) {
					test.ok((new_releaseid == result.releaseid), "Release edited");
				} else {
					test.ok(false, "Edit release errored out");	
				}
				// console.log(res.body);
			} else {
				test.ok(false, "Restify error: " + err);
			}
			test.done();
		});
		
	},
	deleteRelease: function(test){

		client.post('/api/deleteRelease', {
			releaseid: new_releaseid,
			session: {
				username: TEST_USERNAME,
				password: TEST_PASSWORD
			}
		}, function(err, req, res, data) {

			var result = JSON.parse(res.body);

			if (!err) {
				if (!result.error) {
					test.ok(true, "Release deleted");
				} else {
					test.ok(false, "Delete release errored out");	
				}
				// console.log(res.body);
			} else {
				test.ok(false, "Restify error: " + err);
			}
			test.done();
		});
		
	},
	serverKill: function(test) {
		bowline.kill();
		test.ok(true, "Server killed");
		test.done();
	}
	*/

};
