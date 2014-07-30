(function (myRouter, $, undefined) {
  var map, geocoder, origin1, origin2, destinationA, destinationB, bounds = new google.maps.LatLngBounds();

    myRouter.initialize = function () {
      var opts = {
        center: new google.maps.LatLng(37.7833, -122.4167),
        zoom: 12
      };
      map = new google.maps.Map(document.getElementById('map-canvas'), opts);
      geocoder = new google.maps.Geocoder();
    };

    myRouter.calculateDistances = function () {
      origin1 = new google.maps.LatLng($('input[name="aOriginLat"]').val(), $('input[name="aOriginLong"]').val());
      origin2 = new google.maps.LatLng($('input[name="bOriginLat"]').val(), $('input[name="bOriginLong"]').val());
      destinationA = new google.maps.LatLng($('input[name="aDestLat"]').val(), $('input[name="aDestLong"]').val());
      destinationB = new google.maps.LatLng($('input[name="bDestLat"]').val(), $('input[name="bDestLong"]').val());
      var service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix({
        origins: [origin1, origin2, destinationA, destinationB],
        destinations: [destinationA, destinationB, origin2, origin1],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        avoidHighways: false,
        avoidTolls: false
      }, myRouter.callback);
    };

    myRouter.callback = function (response, status) {
      if (status != google.maps.DistanceMatrixStatus.OK) {
        alert('Error was: ' + status);
      } else {
        if (myRouter.validCoordinates(response)) {
          myRouter.clearDirections();
          var origins = response.originAddresses;
          var destinations = response.destinationAddresses;
          var outputDiv = document.getElementById('outputDiv');
          outputDiv.innerHTML = '';
          var driverADistance = response.rows[0].elements[2].distance.value + response.rows[1].elements[1].distance.value + response.rows[3].elements[0].distance.value;
          var driverBDistance = response.rows[1].elements[3].distance.value + response.rows[0].elements[0].distance.value + response.rows[2].elements[1].distance.value;
          if (driverADistance < driverBDistance) {
            var winner = [origin1, destinationA];
            var loser = [origin2, destinationB];
            myRouter.drawRoute(winner, loser);
            outputDiv.innerHTML += "Driver A has a shorter route with a total distance of "
                                + driverADistance + " meters." + '<br>'
                                + "Driver B would have to drive further with a total distance of " 
                                + driverBDistance + " meters." + '<br>';
          } else {
            var winner = [origin2, destinationB];
            var loser = [origin1, destinationA];
            myRouter.drawRoute(winner, loser);
            outputDiv.innerHTML += "Driver B has a shorter route with a total distance of "
                                + driverBDistance + " meters." + '<br>'
                                + "Driver A would have to drive further with a total distance of " 
                                + driverADistance + " meters." + '<br>';
          };
        } else {
          alert("Invalid coordinates");
        };
      };
    };

    myRouter.validCoordinates = function (response) {
      for (var i = 0; i < response.rows.length; ++i) {
        for (var j = 0; j < response.rows[i].elements.length; ++j) {
          if (response.rows[i].elements[j].status == "ZERO_RESULTS") {
            return false;
          };
        };
      };
      return true;
    };

    myRouter.clearDirections = function () {
      if (typeof directionsDisplay !== 'undefined') {
        directionsDisplay.setMap(null);
      };
    };

    myRouter.drawRoute = function (winner, loser) {
      var rendererOptions = { map: map };
      directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
      var waypoints = [{ location: loser[0] }, { location: loser[1] }];
      var request = {
        origin: winner[0],
        destination: winner[1],
        waypoints: waypoints,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
      };
      directionsService = new google.maps.DirectionsService();
      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        } else {
          alert ('failed to get directions');
        };
      });
    };
}(window.myRouter = window.myRouter || {}, jQuery ));

google.maps.event.addDomListener(window, 'load', myRouter.initialize);