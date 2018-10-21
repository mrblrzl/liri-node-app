require("dotenv").config();

var keys = require("./keys.js"); 
var fs = require("fs"); 
var request = require("request"); 
var Spotify = require("node-spotify-api"); 
var moment = require("moment");


var action = process.argv[2];
var value = process.argv[3];

//Spotify 
function spotifyThisSong(value) {
	var trackName = "Diamonds";
	if (value != undefined) {
		trackName = value;
	}
	var spotify = new Spotify({
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
	});
	spotify.search({ type: 'track', query: trackName, limit: 5 }, function(err, data) {
		if (err) {
		    return console.log('Error occurred: ' + err);
		}

		var firstResult = data.tracks.items[0];
		var trackInfo = "* Track Title: " + firstResult.name +
						"* Artist(s): " + firstResult.album.artists[0].name +
						"* Preview Link: " + firstResult.external_urls.spotify +
						"* Album Name: " + firstResult.album.name;		
		var dataArr = trackInfo.split("*");			
		for (i=0; i < dataArr.length; i++) {				
			console.log(dataArr[i].trim());

			fs.appendFile("log.txt", dataArr[i].trim()+"\n", function(err) {
				if (err) {
					return console.log(err);
				}
			});
		}
		console.log("\n===== log.txt was updated with your Music info! =====");
	});
} 

//Do What it says 
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
    	if(error) {
     		console.log(error);
     	}
     	else {
			var randomDataArray = data.split(',');
			var action = randomDataArray[0];
			var value = randomDataArray[1];
			switch (action) {

				case "spotify-this-song":
					spotifyThisSong(value);
					break;
				}
		}
	});
} 

//Movies
function movieThis(value) {
	var movieName = "Halloween";
	if (value != undefined) {
		movieName = value;
	}
	// Then run a request to the OMDB API with the movie specified
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&plot=short&apikey=55ecb61c";
	// Then create a request to the queryUrl
	request(queryUrl, function(error, response, body) {
	  // If the request is successful
		if (!error && response.statusCode === 200) {
            var movieData = JSON.parse(body);

			var movieInfo = "* Movie Title: " + movieData.Title +
							"* The movie's Release Year is: " + movieData.Year +
							"* The movie's IMDB Rating is: " + movieData.Ratings[0].Value +
							"* The movie's Rotten Tomatoes Rating is: " + movieData.Ratings[1].Value +
							"* The movie was produced in: " + movieData.Country +
							"* The movie's Language is: " + movieData.Language +
							"* The movie's Plot is: " + movieData.Plot +
							"* The movie's Actors include: " + movieData.Actors;			
			var dataArr = movieInfo.split("*");			
			for (i=0; i < dataArr.length; i++) {				
				console.log(dataArr[i].trim());
				fs.appendFile("log.txt", dataArr[i].trim()+"\n", function(err) {
					if (err) {
						return console.log(err);
					}
				});
			} 
		console.log("\n===== log.txt was updated with Movie info! =====");
	  	} 
	  	else {
	       console.log(error);
	  	}
	});
} 

//Bands in town 
function concertThis(value){
    
    var url = "https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp";
    request(url, function(error, response, body) {
        if(error){
            return console.log('error: ', error);
        }
        var responseJSON = JSON.parse(body);
        if(responseJSON.length > 0 ){
        
            var result = "\nVenue: " + responseJSON[0].venue.name + "\nLocation: " + responseJSON[0].venue.city + ", " + responseJSON[0].venue.region + "\nDate: " + moment(responseJSON[0].datetime).format("MM-DD-YYYY") + "\n";
        } else {
            var result = "No concerts found";
        }
        
        fs.appendFile('log.txt', 'concert-this ' + value + '\n' + result);
        console.log(result);
    });
    
};

switch (action) {
    case "spotify-this-song":
		spotifyThisSong(value);
		break;

	case "do-what-it-says":
		doWhatItSays();
		break;

	case "movie-this":
		movieThis(value);
		break;
	
	case "concert-this":
		concertThis(value);
		break;

	default:
		console.log("You must pass an action [concert-this, spotify-this-song, movie-this, do-what-it-says] and a value");
		console.log("Ex: node liri.js movie-this Matrix");
		break;
};