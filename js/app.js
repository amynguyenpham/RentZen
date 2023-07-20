"use strict";

/* SOME CONSTANTS */
var endpoint01 = "http://18.191.193.171:8222";
localStorage.usertoken = 0;
localStorage.lastnavlink = '';

/* SUPPORTING FUNCTIONS */
var logoutController = function(){
	localStorage.usertoken = 0;
	//$('.secured').removeClass('unlocked');
	//$('.secured').addClass('locked');
	//need to blank out the renterid tag 
}

var navigationControl = function(the_link){

	/* manage the content that is displayed */
	var idToShow = $(the_link).attr("href");
	localStorage.lastnavlink = idToShow;

	console.log(idToShow);

	if (idToShow == '#div-login' ){
		/* what happens if the login/logout link is clicked? */
		localStorage.usertoken = 0;
		$(".secured").addClass("locked");
		$(".secured").removeClass("unlocked");
	}

	$(".content-wrapper").hide(); 	/* hide all content-wrappers */
	$(idToShow).show(); /* show the chosen content wrapper */
	$("html, body").animate({ scrollTop: "0px" }); /* scroll to top of page */
	$(".navbar-collapse").collapse('hide'); /* explicitly collapse the navigation menu */

} /* end navigation control */
var signup = function(){
	////go get the data off the sign-up form
	var the_serialized_data = $('#form-signup').serialize();
	var urltext = endpoint01+'/renter';

	$.ajax({
		url: urltext,
		type: "POST",
		data: the_serialized_data,
		success: function(result){
			console.log(result);
			console.log(result['renterid']);
		},
		error: function(result){
			console.log(result);
		}	
	});
};

var updateprofile = function(){
	////go get the data off the update profile form
	var the_serialized_data = $('#form-updateprofile').serialize();
	var urltext = endpoint01+'/renter';

	$.ajax({
		url: urltext,
		type: "PUT",
		data: the_serialized_data,
		success: function(result){
			console.log(result);
			$("#updateprofile_message").show();
			$("#updateprofile_message").addClass("alert alert-success");
			$("#updateprofile_message").html("Your profile has been successfully updated!")
		},
		error: function(result){
			console.log(result);
			$("#updateprofile_message").show();
			$("#updateprofile_message").addClass("alert alert-danger");
			$("#updateprofile_message").html("Error! Your profile was unable to be updated. Please try again!");
		}	
	});
}

//Function to show details of a property
var showproperty = function(propertyid){
	
}

// Function to find apartment within a city
var citysearch = function(){
	var the_serialized_data = $('#form-citysearch').serialize();
	var urltext = endpoint01+'/citysearch';

	$.ajax({
		url: urltext,
		type: "GET",
		data: the_serialized_data,
		success: function(result){
			for (var i=0; i<result.length;i++){
				$('#divrow').append(
					"<div class ='col-md-6'>"
					+"<div class = 'img-thumbail'>"
					+"<a href ='#'" + "onclick="
					+"'showproperty(result[i]['propertyid'])'"
					+ ">"
					+ result[i]['street']
					+ "<img class='imf-fluid rounded' style='width: 100%' src='images/no_image.png' alt ='home'>"
					+"</a>"
					+"</div>"
				);
			}
		},
		error: function(result){
			console.log(result); 
		}
	});

	
}

var loginController = function(){
	//go get the data off the login form
	var the_serialized_data = $('#form-login').serialize();
	var urltext = endpoint01+'/renter';


	/*
	$.getJSON(url,the_serialized_data,function(data){
		//console.log(data);
		if (typeof data === 'string'){
			localStorage.usertoken = 0; // login failed.  Set usertoken to it's initial value.
			$('#login_message').html(data);
			$('#login_message').show();
		} else {
			$('#login_message').html('');
			$('#login_message').hide();
			localStorage.usertoken = data['user_id']; //login succeeded.  Set usertoken.
			$('.secured').removeClass('locked');
			$('.secured').addClass('unlocked');
			$('#div-login').hide();
			$('#div-ABC').show();
		}
	}); */

	//use ajax instead 
	$.ajax({
		url:urltext, 
		type: 'GET',
		data: the_serialized_data,
		success: function(result){
			console.log(result);
			console.log(result['renterid']);

			$('#login_message').html('');
			$('#login_message').hide();
			
			//set localStorage 
			localStorage.usertoken = result['renterid']; 
			localStorage.username = result['username'];
			localStorage.password = result['password'];
			localStorage.firstname = result['firstname'];
			localStorage.lastname = result['lastname'];
			localStorage.income = result['income'];
			localStorage.phone = result['phone']; 
			localStorage.creditrating = result['creditrating']; 
			
			
			//login succeeded.  Set usertoken.
			$('.secured').removeClass('locked');
			$('.secured').addClass('unlocked');
			$('#renterid').val(result['renterid']);
			$('#div-login').hide();
			$('#div-dashboard').show();

			$("#profile-renterid").val(localStorage.usertoken);
			$("#profile-username").val(localStorage.username);
			$("#profile-password").val(localStorage.password);
		},
		error: function(result){
			//console.log('nhi is cute');
			console.log(result);
			localStorage.usertoken = 0; // login failed.  Set usertoken to it's initial value.
			$('#login_message').html(result.responseJSON);
			$('#login_message').show();
		}
	});

	//scroll to top of page
	$("html, body").animate({ scrollTop: "0px" });
};


//document ready section
$(document).ready(function (){

    /* ------------------  basic navigation ----------------*/

	/* lock all secured content */
	$('.secured').removeClass('unlocked');
	$('.secured').addClass('locked');


    /* this reveals the default page */
    $("#div-landing").show();

    /* this controls navigation - show / hide pages as needed */

	/* what to do when a navigation link is clicked */
	$(".nav-link").click(function(){
		navigationControl(this);
	});
		
	/* what happens if the login button is clicked? */
	$('#btnLogin').click(function(){
		loginController();
		//$(".content-wrapper").hide();
		//show the dashboard div
		//$("#div-dashboard").show();
	});

	/* what happens if the signup button is clicked? */
	$('#btnSignup').click(function(){
		//hide all content wrappers 
		$(".content-wrapper").hide();
		//show the next div
		$("#div-signup").show();
		
	});
	
	/* what happens if the signin button is clicked? */
	$('#btnSignup2').click(function(){
		//hide all content wrappers 
		$(".content-wrapper").hide();
		//show the next div
		$("#div-signupconfirm").show();
		signup();
	});

	$('#btnUpdateProfile').click(function(){
		updateprofile();
	});

	/* what happens if the signin button is clicked? */	
	$('#btnSignin').click(function(){
		//hide all content wrappers 
		$(".content-wrapper").hide();
		//show the next div
		$("#div-login").show();
	});

	/* what happens if the signin2 button is clicked? */	
	$('#btnSignin2').click(function(){
		//hide all content wrappers 
		$(".content-wrapper").hide();
		//show the next div
		$("#div-login").show();
	});

	/* what happens if the Search City button is clicked */
	$('#btnSearchCity').click(function(){
		//hide all content wrappers 
		$(".content-wrapper").hide();
		//show the next div
		$("#div-resultfindyourhome").show();
		citysearch();
	});

	/* what happens if the Fake Search Property button is clicked */
	$('#btnfakepropertydetail').click(function(){
		//hide all content wrappers 
		$(".content-wrapper").hide();
		//show the next div
		$("#div-propertydetail").show();
	});

	/* what happens if the Fake Search Property button is clicked */
	$('#btnApply').click(function(){
		//hide all content wrappers 
		$(".content-wrapper").hide();
		//show the next div
		$('#div-rentalapplication').show();
	});


	/* what happens if the logon on menu is clicked */ 
	$('#dashboard-logout').click(function(){
		logoutController();
	});

	$('#a-properties').click(function(){
		//hide all content wrappers 
		$(".content-wrapper").hide();
		//show the next div
		$("#div-findyourhome").show();
		$()
	});

	$('#a-updateprofile').click(function(){
		//hide all content wrappers 
		$(".content-wrapper").hide();
		//show the next div
		$("#div-updateprofile").show();
		console.log(localStorage.username);
		$("#profile-renterid").val(localStorage.usertoken);
		$("#profile-username").val(localStorage.username);
		$("#profile-password").val(localStorage.password);
		$("#profile-firstname").val(localStorage.firstname);
		$("#profile-lastname").val(localStorage.lastname);
		$("#profile-phone").val(localStorage.phone);
		$("#profile-creditrating").val(localStorage.creditrating);
		$("#profile-income").val(localStorage.income);
	})




}); /* end the document ready event*/