var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [25, 0],
    zoom: 2,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

   // add legend
   var legend = L.control({ position: 'bottomright' });
   legend.onAdd = function (map) {
     var div = L.DomUtil.create('div', 'info legend'),
       depth = [-10, 10, 30, 50, 70, 90];
     // loop through our magnitude intervals and generate a label with a colored square for each interval
     for (var i = 0; i < depth.length; i++) {
       div.innerHTML +=
         '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' +
         depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
     }
     return div;
   };
   legend.addTo(myMap);
};

// Perform a GET request to the query URL/
d3.json(link).then(createFeatures);
  // Once we get a response, send the data.features object to the createFeatures function.


function getColor(d) {
  return d > 90 ? 'red' :
    d > 70 ? '#FF8C00' :
      d > 50 ? '#FF7F50' :
        d > 30 ? '#FFD700' :
          d > 10 ? '#32cd32' :
            '#ADFF2F';
};

function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Time: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p>
        <p>Depth: ${feature.geometry.coordinates[2]}</p>`)
  }

  function pointToLayer(feature, latlng) {
    var earthquakeMarkers = {
      fillOpacity: 0.75,
      color: "grey",
      fillColor: getColor(feature.geometry.coordinates[2]),
      radius: feature.properties.mag * 40000,
      weight: 0.25
    }
    return L.circle(latlng, earthquakeMarkers)

  }

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer,
  });

  // // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);

 
};



