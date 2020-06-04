// Store our API endpoint inside queryUrl
function buildUrl(){
    // With this you can select a range of dates to display in the map
    //------------------------------------------
    // const
    //     domain = "earthquake.usgs.gov",
    //     endpoint = "/fdsnws/event/1/query",
    //     format = "geojson",
    //     starttime = "2020-06-01",
    //     endtime = "2020-06-02",
    //     maxLon = -69.52148437,
    //     minLon = -123.83789062,
    //     maxLat = 48.74894534,
    //     minLat = 25.16517337;

    // return `https://${domain}${endpoint}?format=${format}&starttime=${starttime}&endtime=${endtime}&maxlongitude=${maxLon}&minlongitude=${minLon}&maxlatitude=${maxLat}&minlatitude=${minLat}`;
    
    // API URL of past 7 significant earthquakes
    //------------------------------------------
    return "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
} 

// Function to get the api from https://earthquake.usgs.gov/
(async function() {
    const queryUrl = buildUrl();
    const data = await d3.json(queryUrl);
    // When we get a response, send the data.features object
    createFeatures(data);
})()

function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake

    // function onEachFeature(feature, layer) {
    //     L.circle(feature.properties.place, {
    //         fillOpacity: 0.75,
    //         color: "white",
    //         fillColor: "orange",
    //         radius: feature.properties.mag * 1000
    //     }).bindPopup("<h3>" + feature.properties.place +
    //     "</h3><hr><p>" + feature.properties.mag + "</p>");
    // }

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>" +
        "<p>" + new Date(feature.properties.time) + "</p>");
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    const earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

    // Adding title layer
    const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    const lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });
    
      // Define a baseMaps object to hold our base layers
    const baseMaps = {
            "Surface Map": streetmap,
            "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    const overlayMaps = {
            Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    const myMap = L.map("map", {
            center: [37.09, -95.71],
            zoom: 5,
            layers: [streetmap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
    }).addTo(myMap);

(async function(){
    // const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    const url = buildUrl();
    const data = await d3.json(url);

    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
})()

