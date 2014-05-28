var request = require('request');
var cheerio = require('cheerio');


getHTML = function(url) {
	var html = '';
	request(url, function(error, response, pagesrc) {
		if (error) {
			html = 'err';
			console.log(error);
		} else {
			html = pagesrc;
		}
	});

	return html;
}


// seed:    an array of URLs
// timeout: [optional] seconds between request
Scraper = function(seed, timeout) {
	this.urls = seed;
	this.to = timeout;
}

var scraped = {};
var prefix = "http://tedbox.dhcp.tripadvisor.com";

scan = function(validate, process, url) {
	if (!scraped[url]) {
		scraped[url] = 1;

		request(url, function(error, response, pagesrc){
			if (error) {
				console.log("ERR: "+url);
				console.log(error);
			} else {
				var $ = cheerio.load(pagesrc);
				var parse = validate($, pagesrc, url);

				$('a').each(function(i, s){
					var branch = $(this).attr('href');
					if (branch && branch[0] == '/') {
						branch = prefix + branch;
						if (parse == 2) {
							setImmediate(function(){
								scan(validate, process, branch);
							});
						}
					}
				});

				if (parse > 0) {
					process($, url);
				}
			}
		});
	}
}

Scraper.prototype.start = function(val, proc) {
	scan(val, proc, prefix+this.urls[0]);
};

var s = new Scraper(["/Hotel_Review-g54122-d1723668-Reviews-The_Ocean_House-Watch_Hill_Westerly_South_County_Rhode_Island.html"]);


isInWatchHill = function($, pagesrc, url) {
	if (url.indexOf("g54122") > -1) {
		return 2;
	}
	return 0;
}

print = function(c,u) {
	console.log(u);
}


s.start(isInWatchHill, print);



















