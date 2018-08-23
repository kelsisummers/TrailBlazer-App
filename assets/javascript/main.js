// Initialize Firebase
var config = {
    apiKey: "AIzaSyBEwnr_R2pjbyqaKWxKuSyQBtm3LbTdgS4",
    authDomain: "trailblazer-project.firebaseapp.com",
    databaseURL: "https://trailblazer-project.firebaseio.com",
    projectId: "trailblazer-project",
    storageBucket: "trailblazer-project.appspot.com",
    messagingSenderId: "615321105967"
};

firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();


// Document Loads Before Code Runs
$(document).ready(function() {
    $('select').material_select('destroy');
    $('select').material_select();

    // Updates Miles in HTML When Range is Clicked
    $('.range-field').on('click', function(event){
        $('#miles-value').text($('#radius-input').val() + ' miles');
    });

  // When Submit Button is Clicked
$(('#submit-button')).on('click', function (event){
    var latitude;
    var longitude;

    // Clear Trail Divs
    $('.row-1').empty();
    $('.row-2').empty();
    $('.row-3').empty();

    // Prevent the page from refreshing
    event.preventDefault();

    // Stores Inputs as Variables
    var city = $("#city-input").val().trim();
    // console.log('City: ', city);
    var state = $('#state-input').val();
    // console.log('State: ', state)
    var radius = $("#radius-input").val();
    // console.log('Search Radius: ', radius)

    // Prevents Submit If Fields Are Empty
    if (city==="" || state==="" || radius ==="") {
        alert('Error! Please Enter All Info.')

    // Otherwise
    } else {
        // Grab Latitude and Longitude from API
        var googleURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + city + ',+' + state + '&key=AIzaSyBNceJKZRhFdZSITn-8ZwmzDyJ8Co6iZhQ'

        $.ajax({
            url: googleURL,
            method: "GET",

            // When AJAX Call is "Done"
            }).done(function(response) {
                // console.log(response);
                for (var i=0; i<response.results.length;i++) {
                    // console.log(response.results[i].geometry.location);
                    latitude = response.results[i].geometry.location.lat
                    // console.log(latitude)
                    longitude = response.results[i].geometry.location.lng
                    // console.log(longitude)
                }
            // Save Variables to Firebase Database
            database.ref('/searches').push({
                city: city,
                radius: radius,
                state: state,
                longitude: longitude,
                latitude: latitude,
            })

            // Save Data to Local Storage For Second Page Functions
            localStorage.clear();
            localStorage.setItem('cityLat', latitude);
            localStorage.setItem('cityLong', longitude);
            localStorage.setItem('cityName', city);

        // Calls Trail Info Function
        displayTrailInfo(latitude, longitude, radius);
        })
    }
});

// Function to Display Trail Info
function displayTrailInfo(latitude, longitude, radius) {

    // Empties Trail Info Container
    $('#trail-info').empty();
    $('#trail-info').append('<div class="row row-1"</div>');
    $('#trail-info').append('<div class="row row-2"</div>')
    $('#trail-info').append('<div class="row row-3"</div>')

    // Hiking Project API Key
    var apiKey = '200209309-2a8d10ade11cd96cedf39716cfa65127';

    // Creates URL with Search Term for Trail API
    var trailURL ='https://www.hikingproject.com/data/get-trails?lat=' + latitude + '&lon=' + longitude + '&sort=distance&maxResults=12&maxDistance=' + radius + '&key=' + apiKey;

    // AJAX Call from API
    $.ajax({
        url: trailURL,
        method: "GET",
        // When AJAX Call is "Done"
        }).success(function(response) {
            // console.log(response);



            // Creates First Row of Trails w/ Data Attributes
            for (var i=0; i<4;i++) {
                // console.log('images?', response.trails[i].imgSmallMed);
            if (response.trails[i].imgSmallMed === "") {
                response.trails[i].imgSmallMed = "assets/images/camping.jpg"
            }
            $('.row-1').append(
                '<div class="col s12 m6 l3 xl3"><div class="card trail" data-name="' + response.trails[i].name +'"data-location="' + response.trails[i].location + '"data-latitude="' + response.trails[i].latitude + '"data-longitude="' + response.trails[i].longitude
                + '"data-id="' + response.trails[i].id + '"data-summary="' + response.trails[i].summary + '"data-imageUrl="' + response.trails[i].imgMedium + '"><div class="card-image"><img class="thumbnail" src="' + response.trails[i].imgSmallMed + '"><span class="card-title name">' + response.trails[i].name + '</span></div><div class="card-content"><p>Trail Summary: ' +response.trails[i].summary + '</p><br><p>Location: ' + response.trails[i].location + '</p><br><p>Length: ' + response.trails[i].length + ' miles</p></div><div class="card-action"><a id="trail-link" href="page-two-trail-info.html">More Trail Info</a></div</div></div>'
                )

                // Saves Data to HTML Element
                $('.trail').data('imageUrl', response.trails[i].imgMedium);
                $('.trail').data('conditionStatus', response.trails[i].conditionStatus);
                $('.trail').data('conditionDetails', response.trails[i].conditionDetails);
                $('.trail').data('conditionDate', response.trails[i].conditionDate);
            }

            // Creates Second Row of Trails w/ Data Attributes
            for (var i=4; i<8;i++) {
                // console.log('images?', response.trails[i].imgSmallMed);
                if (response.trails[i].imgSmallMed === "") {
                    response.trails[i].imgSmallMed = "assets/images/camping.jpg"
                }
                $(".row-2").append('<div class="col s12 m6 l3 xl3"><div class="card trail" data-name="' + response.trails[i].name + '"data-location="' + response.trails[i].location + '"data-latitude="' + response.trails[i].latitude + '"data-longitude="' + response.trails[i].longitude + '"data-id="' + response.trails[i].id + '"data-summary="' + response.trails[i].summary + '"data-imageUrl="' + response.trails[i].imgMedium + '"><div class="card-image"><img class="thumbnail" src="' + response.trails[i].imgSmallMed + '"><span class="card-title">' + response.trails[i].name + '</span></div><div class="card-content"><p>Trail Summary: ' + response.trails[i].summary + "</p><br><p>Location: " + response.trails[i].location + "</p><br><p>Length: " + response.trails[i].length + ' miles</p></div><div class="card-action"><a id="trail-link" href="page-two-trail-info.html">More Trail Info</a></div</div></div>');

                // Saves Data to HTML Element
                $('.trail').data('imageUrl', response.trails[i].imgMedium);
                $('.trail').data('conditionStatus', response.trails[i].conditionStatus);
                $('.trail').data('conditionDetails', response.trails[i].conditionDetails);
                $('.trail').data('conditionDate', response.trails[i].conditionDate);
            }

            // Creates Third Row of Trails w/ Data Attributes
            for (var i=8; i<12;i++) {
                // console.log('images?', response.trails[i].imgSmallMed);
                if (response.trails[i].imgSmallMed === "") {
                    response.trails[i].imgSmallMed = "assets/images/camping.jpg"
                }
                $(".row-3").append('<div class="col s12 m6 l3 lx3"><div class="card trail" data-name="' + response.trails[i].name + '"data-location="' + response.trails[i].location + '"data-latitude="' + response.trails[i].latitude + '"data-longitude="' + response.trails[i].longitude + '"data-id="' + response.trails[i].id + '"data-summary="' + response.trails[i].summary + '"data-imageUrl="' + response.trails[i].imgMedium + '"><div class="card-image"><img class="thumbnail" src="' + response.trails[i].imgSmallMed + '"><span class="card-title">' + response.trails[i].name + '</span></div><div class="card-content"><p>Trail Summary: ' + response.trails[i].summary + "</p><br><p>Location: " + response.trails[i].location + "</p><br><p>Length: " + response.trails[i].length + ' miles</p></div><div class="card-action"><a id="trail-link" href="page-two-trail-info.html">More Trail Info</a></div</div></div>');

                // Saves Data to HTML Element
                $('.trail').data('imageUrl', response.trails[i].imgMedium);
                $('.trail').data('conditionStatus', response.trails[i].conditionStatus);
                $('.trail').data('conditionDetails', response.trails[i].conditionDetails);
                $('.trail').data('conditionDate', response.trails[i].conditionDate);
            }

        // If AJAX Doesn't Work, Error is Logged to Console
        }).error(function(error){
            console.log('Error', error);
        })
};

// When a Trail is Clicked...
$(document).on('click', '.trail', function(event){

    // Takes Data from HTML Element, Saves It As Variable
    var trailLatitude = $(this).data("latitude");
    var trailLongitude = $(this).data('longitude');
    var trailName = $(this).data("name");
    var trailSummary = $(this).data("summary");
    var trailLocation = $(this).data('location');
    var trailImageUrl = $(this).data('imageUrl');
    var trailId = $(this).data('id');
    var conditionStatus = $(this).data('conditionStatus');
    var conditionDetails = $(this).data('conditionDetails');
    var conditionDate = $(this).data('conditionDate');
    var trailCityState = trailLocation.split(", ");
    var trailCity = trailCityState[0];
    trailCity.replace(' ', '+');
    var trailState = trailCityState[1];

    // Stores Variables (Data) to Local Storage
    localStorage.setItem("name", trailName);
    localStorage.setItem("summary", trailSummary);
    localStorage.setItem("location", trailLocation);
    localStorage.setItem("longitude", trailLongitude);
    localStorage.setItem("latitude", trailLatitude);
    localStorage.setItem("imageUrl", trailImageUrl);
    localStorage.setItem("id", trailId);
    localStorage.setItem("conditionStatus", conditionStatus);
    localStorage.setItem("conditionDetails", conditionDetails);
    localStorage.setItem("conditionDate", conditionDate);
});
});
