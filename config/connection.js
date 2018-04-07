var mongoose = require("mongoose");

// Local Database Configuration with Mongoose
// mongoose.connect("mongodb://localhost/mongoHeadlines", function(error)
// 	{if(error) throw error;
// 	console.log("Database connected");
// });

// mLab database
mongoose.connect("mongodb://test:test@ds237989.mlab.com:37989/heroku_3wsxcs99", function(err) {
	if(err) throw err;
	console.log('database connected');
});