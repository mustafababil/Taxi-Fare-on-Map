# Taxi-Fare-on-Map
Taxi Fare estimation on Google Maps in Copenhagen and Roskilde Districts in Denmark

It basically allows users to select their departure and arrival points on the interactive map, then in return the system informs the user about the departure and arrival addresses, the distance between them and the approximate price via taxi.

The application is also capable of showing alternative routes between the places. People can see 3 alternative routes at all and compare the prices to the another.

## The Background

The single web page mainly integrates 2 APIs together. First one is <a href="https://developers.google.com/maps/documentation/javascript/">Google Maps JavaScript API v3</a> and the second one is <a href="http://geo.oiorest.dk/">GeoService of OIORest</a>. I also benefit from <a href="https://jquery.com/">jQuery</a> to handle button actions easily.

The basic idea is that Google Maps API draws the map, user selects the points, GeoService returns the addresses according to the coordinates of points, Google Maps API calculates the distance and the price is calculated according to the distance by the application itself.

In more detailed view;
<ul>
	<li><em>initmap()</em> function, the options of the map is setted and map is initialized on the page.</li>
<br>	
	<li><em>initialize()</em> function, a listener is added to the map. This listener calls a function that adds a marker on the map.</li>
<br>	
	<li><em>createMarker()</em> function creates first and second marker as departure and arrival markers. After it creates the marker, it adds a listener on each marker called <em>dragendEvent()</em>.</li>
<br>	
	<li><em>dragendEvent()</em> function is called whenever the position of a marker is changed. This function triggers <em>redraw()</em> function to make calculations again.</li>
<br>	
	<li><em>redraw()</em> function calls <em>findRoute()</em> function with positions of first and second markers as a parameter.</li>
<br>	
	<li><em>findRoute()</em> function takes the two marker as a parameter and draws the route between them on the map. After it draws the route, it calls <em>dirOnHead()</em> to reflect the results according to this route.</li>
<br>	
	<li><em>dirOnHead()</em> prints the addresses of departure and arrival points, the distance between them and the approximate price with taxi on the web page. To find distance, it uses the property of the route variable in Google Maps API. To find the exact addresses of the places on the map, it sends a JSON request to GeoService of OIORest with the coordinations of them. To interpret returning JSON file in a user friendly way, it calls <em>findDepartAddr()</em> and <em>findArriveAddr()</em>.</li>
<br>	
	<li><em>findDepartAddr()</em> and <em>findArriveAddr()</em> reads the JSON file and convert it to a readable text format.</li>
<br>	
	<li><em>alterit() is triggered when the “Alternative Route” button is pressed. It draws the new route and calls <em>dirOnHead()</em> to calculate the new results.</li>
</ul>


## Demo
http://mustafababil.com/projects/taxifare/


## Screenshot
<img src="http://i.imgur.com/W2GHXXd.png" alt="Taxi-fare-finder" />
