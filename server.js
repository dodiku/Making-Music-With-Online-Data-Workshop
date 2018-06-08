'use strict;';

//Express
var express = require('express');
var app = express();

//HTTP
var http = require('http').createServer(app);

//Port - Useful for heruko or places where port gets set for us
var port = process.env.PORT || 2912;

//Run the server with the port
var server = app.listen(port);

console.log('Server is running at localhost:' + port);

var io = require('socket.io').listen(server);

var ejs = require('ejs');

var Twit = require('twit');

var TwitterAPI = new Twit({
    consumer_key: 'your_consumer_key',
    consumer_secret: 'your_consumer_secret',
    access_token: 'your_access_token',
    access_token_secret: 'your_access_token_secret',
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
});

//Setup the views folder
app.set('views', __dirname + '/views');

//Setup ejs, so we can write HTML(:
app.engine('.html', ejs.__express);
app.set('view-engine', 'html');

//Setup the public client folder
app.use(express.static(__dirname + '/public'));

//Socket messages
//Let's define a couple of constrains
var NYC = [ '-73.98', '40.85', '-73.87', '40.69' ];
var filters = 'creative';

var tweetStream = TwitterAPI.stream('statuses/filter', {track: filters}, {locations: NYC});


io.on('connection', function (client) {
    //We don't really need this one since we will be emitting messages from the server but this is the pattern for building socket communication using Socket.io
    console.log('user is connected:' + client.id);
});

//Register what happens when we get a new twitt
tweetStream.on('tweet', function(tweet){

    //Show us the text
    console.log(tweet.text + '\n'); // Get rid of text to see all the stuff that Twitter gives us - GET CREATIVE WITH IT!

    //This sends everybody connected and not just a uniqe socket - GOOD FOR BOLD ANNOUNCEMENTS!
    // io.sockets.emit('note', tweet.text, tweet.user.screen_name, tweet.user.followers_count);

});

//Router - we only have one route
app.get('/', function (req, res) {
    res.render('index.html');
});
