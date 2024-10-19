function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for (var i in uiBathrooms) {
      if (uiBathrooms[i].checked) {
          return parseInt(i) + 1; // Return the bathroom count (1-5)
      }
  }
  return -1; // Invalid Value
}

function getBHKValue() {
  var uiBHK = document.getElementsByName("uiBHK");
  for (var i in uiBHK) {
      if (uiBHK[i].checked) {
          return parseInt(i) + 1; // Return the BHK count (1-5)
      }
  }
  return -1; // Invalid Value
}

function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");

  // Get the input values
  var sqft = parseFloat(document.getElementById("uiSqft").value);
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var location = document.getElementById("uiLocations").value;
  var estPrice = document.getElementById("uiEstimatedPrice");

  // Validation
  if (isNaN(sqft) || sqft <= 0 || bhk === -1 || bathrooms === -1 || !location) {
      alert("Please fill in all fields correctly.");
      return;
  }

  // Define the API URL
  var url = "http://127.0.0.1:5000/predict_home_price"; // Adjust if needed

  // Send POST request to the server
  $.post(url, {
      total_sqft: sqft,
      bhk: bhk,
      bath: bathrooms,
      location: location
  }, function (data, status) {
      // Handle the response
      console.log(data);
      if (data && data.estimated_price) {
          // Format and display the estimated price with currency symbol
          const currencyIcon = '<i class="bi bi-currency-rupee"></i>';
          estPrice.innerHTML = "<h2>" + currencyIcon +""+ data.estimated_price.toLocaleString() + " Lakh</h2>";
      } else {
          estPrice.innerHTML = "<h2>No price estimated</h2>";
      }
      console.log(status);
  }).fail(function (xhr, status, error) {
      // Handle error
      console.error("Error occurred: ", error);
      estPrice.innerHTML = "<h2>Error estimating price</h2>";
  });
}

function onPageLoad() {
  console.log("Document loaded");

  // Define the API URL
  var url = "http://127.0.0.1:5000/get_location_names"; // Adjust if needed

  // Send GET request to the server
  $.get(url, function (data, status) {
      console.log("Got response for get_location_names request");
      if (data) {
          var locations = data.locations;
          var uiLocations = document.getElementById("uiLocations");
          $('#uiLocations').empty(); // Clear previous options
          for (var i in locations) {
              var opt = new Option(locations[i]);
              $('#uiLocations').append(opt); // Add each location as an option
          }
      }
  }).fail(function (xhr, status, error) {
      // Handle error
      console.error("Error fetching locations: ", error);
  });
}

// Execute onPageLoad when the window loads
window.onload = onPageLoad;
