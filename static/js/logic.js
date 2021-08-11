var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";
// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
  geoLayer = L.geoJson(data, {

    style: function(feature) {
      var mag = feature.properties.mag;
      return {
        radius: mag * 4
      }
      var depth = feature.geometry.coordinates[2];
      if (depth >= 4.0) {
        return {
          color: "red"
        }; 
      }
      else if (depth >= 3.0) {
        return {
          color: "orange"
        };
      } else if (depth >= 2.0) {
        return {
          color: "yellow"
        };
      } else {
        return {
          color: "green"
        }
      }
    },

    onEachFeature: function(feature, layer) {

      var popupText = "<b>Magnitude:</b> " + feature.properties.mag +
        "<br><b>Location:</b> " + feature.properties.place ;

      layer.bindPopup(popupText, {
        closeButton: true,
        offset: L.point(0, -20)
      });
      layer.on('click', function() {
        layer.openPopup();
      });
    },
    
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: Math.round(feature.properties.mag) * 3,
      });
    },
  }).addTo(myMap);
  
});