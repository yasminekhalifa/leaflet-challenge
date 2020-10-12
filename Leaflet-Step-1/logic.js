// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function colourMarker(mag) {
  if(mag<1){
    return "green";
  }else if(mag<2){
    return "blue";
  }else if(mag<3){
    return "yellow";
  }else if(mag<4){
    return "orange";
  }else if(mag<5){
    return "green";
  }else{
    return "red";
  }
}

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.title +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData,{
    pointToLayer: function(feature, latlng) {

      return new L.CircleMarker(latlng, {
        radius: 5*feature.properties.mag,
        color: colourMarker(feature.properties.mag),
      });
    },
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });


  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  var info = L.control({
    position: "bottomright"
  });
  
  // When the layer control is added, insert a div with the class of "legend"
  info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
  };
  // Add the info legend to the map
  info.addTo(myMap);

  legend();
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);

}

function legend() {
  document.querySelector(".legend").innerHTML = [
    "<div style='color: white; background-color:green; padding: 10px;'> 0 - 1 </div>",
    "<div style='color: white; background-color:blue; padding: 10px;'> 1 - 2 </div>",
    "<div style='color: white; background-color:yellow; padding: 10px;'> 2 - 3 </div>",
    "<div style='color: white; background-color:orange; padding: 10px;'>  3 - 4 </div>",
    "<div style='color: white; background-color:green; padding: 10px;'>  4 - 5 </div>",
    "<div style='color: white; background-color:red; padding: 10px;'>  5+ </div>",
  ].join("");
}