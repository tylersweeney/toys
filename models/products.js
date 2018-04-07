var mongoose = require("mongoose");

var productsSchema = new mongoose.Schema({
	title: {
		type: String, 
	},
	link: {
		type: String, 
	},	
	imgLink: {
		type: String, 
	},
	manufacturer: {
		type: String, 
	},
	msrp: {
		type: String, 
	},
	
	createdAt: {
		type: Date, 
		default: Date.now
	}
});

var Products = mongoose.model("Products", productsSchema);

module.exports = Products;