$(document).ready(function(){

	// Default variables
	var productList = [];
	var productId = '';
	var product = '';
	var previousProduct = 0;
	var currentProduct = 0;
	var nextProduct = 0;	

	$('#comments').addClass('hidden');

	// Scrape website on initial page load
	$.getJSON('/scrape', function(){
	});

	// Get all articles when read articles button clicked and build an array of articles
	$(document).on('click','#getProducts', function(){
		$.getJSON('/products', function(data){
			productList = data;
			product = productList[0];
			showProduct(product);
		}); 		
	});

	// Display previous article from the array of articles
	$(document).on('click','.previous', function(){
		product = productList[previousProduct];
		currentProduct = previousProduct;
		showProduct(product);
	}); 

	// Display next article from the array of articles
	$(document).on('click','.next', function(){
		product = productList[nextProduct];
		currentProduct = nextProduct;
		showProduct(product);
	}); 

	// Add comment to article and update comments display
	$(document).on('click','#addComment', function(){
		if($('#commentText').val() != '') {
			var name = $('#name').val();
			var comment = $('#commentText').val();
			$.post("/addcomment/" + productId, {name: name, comment: comment}, function(e) {
				e.preventDefault();
			});
			$('#name').val('');
			$('#commentText').val('');
			showComments(productId);
		}
	});	
	
	// Delete comment from article and update comments display
	$(document).on('click','.deletecomment', function(){
		commentId = this.id;
		// console.log("comment id "+ commentId);
		$.ajax({
			method: "GET",
			url:"/deletecomment/" + commentId
		}).done(function(data){
		})
		showComments(productId);
	});		

	// Function to build article display
	var showProduct = function(product) {
		$('#title').text(product.title);
		$("#image").removeClass("hidden");
		$('#image').attr('src', product.link);
		$('#msrp').text(product.msrp);
		$("#readProduct").removeClass("hidden");
		$('#readproduct').attr('href', product.link);
		$("#getProducts").addClass("hidden");
		$("#navigation").empty();
		previousProduct = currentProduct - 1;
		if(previousProduct >= 0) {
			$('#navigation').append('<button id="'+previousProduct+'" class="btn btn-primary previous">Previous Product</button>');
		} else {
			$('#navigation').append('<button id="'+previousProduct+'" class="btn btn-primary disabled previous">Previous Product</button>');
		}
		nextProduct = currentProduct + 1;
		if(nextProduct < productList.length) {
			$('#navigation').append('<button id="'+nextProduct+'" class="btn btn-primary pull-right next">Next Product</button>');
		} else {
			$('#navigation').append('<button id="'+nextProduct+'" class="btn btn-primary pull-right disabled next">Next Product</button>');
		}
		productId = product._id;
		showComments(productId);
	}

	// Function to build comments display for article
	var showComments = function(productId) {
		$("#comments").removeClass("hidden");
		$("#productComments").empty();
		var commentText = '';
		$.getJSON('comments/'+productId, function(data){
			for(var i = 0; i < data.length; i++){
				commentText = commentText + '<div class="well"><span id="'+data[i]._id+'" class="glyphicon glyphicon-remove text-danger deletecomment"></span> '+data[i].comment+' - '+data[i].name+'</div>';
			}
			$("#productComments").append(commentText);
		});
	}

});