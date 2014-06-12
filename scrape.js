var request = require('request');
var cheerio = require('cheerio');

URLToCloud = function(url, cb) {
	request(url, function(error, response, pagesrc){
		var $ = cheerio.load(pagesrc);
		var srcs = $('.user-generated-content').text();
		srcs = srcs.replace(/[0-9\-\"\?\n\'\,\!\.\:\(\)]/g, '');
		var each = srcs.split(" ");
		var cloud = {};
		each.forEach(function(every){
			if (every.length < 4 || every.indexOf("http") > -1) {
				return;
			}
			every = every.toLowerCase();
			if (cloud[every]) {
				cloud[every] = cloud[every]+1;
			} else {
				cloud[every] = 1;
			}
		});
		cb(cloud);
	});
}

//URLToCloud("http://www.realself.com/review/washington-dc-rhinoplasty-natural-beauty", function(result) {
//	console.log(result);
//});


getRevUrlsFromSP = function(url, cb) {
	request(url, function(error, response, pagesrc){
		var $ = cheerio.load(pagesrc);
		var cloud;
		var srcs = $('.link-read-more');
		var sum = 0;
		var top = srcs.length;

		top = top*(top-1)/2;
		srcs.each(function(index, every){
			var branch = $(this).attr('href');
			if (branch && branch[0] == '/') {
				var nurl = "http://www.realself.com"+branch;
				URLToCloud(nurl, function(ncl){
					sum += index;
					if (cloud) {
						for (prop in ncl) {
							if (!ncl.hasOwnProperty(prop)) {
								continue;
							}
							if (!cloud[prop]) {
								cloud[prop] = 0;
							}
							cloud[prop] += ncl[prop]
							if (prop.indexOf("/") > -1) {
								cloud[prop] = 0;
							}
						}
					} else {
						cloud = ncl;
					}
					if (sum == top) {
						cloud.this = 0;
						cloud.that = 0;
						cloud.have = 0;
						cloud.with = 0;
						cloud.will = 0;
						cb(cloud);
					}
				})
			}
		});
	});

}


getRevUrlsFromSP("http://www.realself.com/Rhinoplasty/Nose-job/reviews", function(each){
	console.log(each);
});


