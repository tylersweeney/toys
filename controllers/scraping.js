
var express = require('express');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();
var mongoose = require('mongoose');
var Promise = require("bluebird");

// Assign Mongoose promise
mongoose.Promise = Promise;

// Mongodb models
var Products = require("../models/products");
var Comments = require("../models/comments");

// Website To Be Scraped
var url = "https://ttpm.com/c/4/arts-crafts-activity-toys/";

// Test Route To Verify Scraping Works From Route
router.get('/test', function(req, res) {
    // body of the html with request
    request(url, function(error, response, html) {
        // load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(html);
		var result = [];
		$(".item-container").each(function(i, element) {
	var title = $(element).find(".product_image").find("img").attr("title");
    var imgLink = $(element).find(".product_image").find("img").attr("src").split(",")[0].split(" ")[0];
    var manufacturer = $(element).find("p.manufacturer_name").find("em").text();
    var msrp = $(element).find("span.product_msrp").text();
			 // Push the results into the array
			 results.push({ 
				title:title,
				link: imgLink,
			  manufacturer: manufacturer,
			  msrp: msrp
		   });
		});
		console.log(result);
		res.send(result);
    });
});

// Default route renders the index handlebars view
router.get('/', function(req, res){
	res.render('index');
});

// Scrape the website and assign stories to the database. Checks to verify story has not been added previously.
router.get('/scrape', function(req, res){
    request(url, function(error, response, html) {	
        var $ = cheerio.load(html);
		var result = [];
		// Scrape website
		$(".item-container").each(function(i, element) {
			var title = $(element).find(".product_image").find("img").attr("title");
			var imgLink = $(element).find(".product_image").find("img").attr("src").split(",")[0].split(" ")[0];
			var manufacturer = $(element).find("p.manufacturer_name").find("em").text();
			var msrp = $(element).find("span.product_msrp").text();
					 // Push the results into the array
					 result.push({ 
						title:title,
						link: imgLink,
					  manufacturer: manufacturer,
					  msrp: msrp
				   });
			// Check database to see if story saved previously to database
			Products.findOne({'title': title}, function(err, productRecord) {
				if(err) {
					console.log(err);
				} else {
					if(productRecord == null) {
						Products.create(result[i], function(err, product) {
							if(err) throw err;
							console.log("Product Added");
						});
					} else {
						console.log("No product Added");
					}					
				}
			});	
		});
    });	
});

// Get all current articles in database
router.get('/products', function(req, res){
	Products.find().exec(function(err, data) { 
		if(err) throw err;
		res.json(data);
	});
});

// Get all comments for one article
router.get('/comments/:id', function(req, res){
	Comments.find({'productId': req.params.id}).exec(function(err, data) {
		if(err) {
			console.log(err);
		} else {
			res.json(data);
		}	
	});
});

// Add comment for article
router.post('/addcomment/:id', function(req, res){
	console.log(req.params.id+' '+req.body.comment);
	Comments.create({
		productId: req.params.id,
		name: req.body.name,
		comment: req.body.comment
	}, function(err, docs){    
		if(err){
			console.log(err);			
		} else {
			console.log("New Comment Added");
		}
	});
});

// Delete comment for article
router.get('/deletecomment/:id', function(req, res){
	console.log(req.params.id)
	Comments.remove({'_id': req.params.id}).exec(function(err, data){
		if(err){
			console.log(err);
		} else {
			console.log("Comment deleted");
		}
	})
});

module.exports = router;