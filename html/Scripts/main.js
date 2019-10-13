
    function FadeFunction(country) {
  var x = document.getElementById(country);
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
	// pre-defined variables
	var cityArray = {
		Malaysia: "Malaysia",
		Indonesia: "Jakarta",
		Cambodia: "Phnom Penh",
		Brunei: "Bandar Seri Begawan",
		Vietnam: "Ho Chi Minh City"
	};
	var countryArray = {
		MY: "Malaysia",
		ID: "Indonesia",
		KH: "Cambodia",
		BN: "Brunei",
		VN: "Vietnam"
	};
	var countryCodeMapping = {
		Malaysia: 149,
		Indonesia: 95,
		Vietnam: 225,
		Cambodia: 108,
		Brunei: 26
	};
	
	// pre-defined function code
	function getWeather(country_Name, weatherid){
				// Parse user-defined location into OpenWeather API
				var settings_2 = {
					"async": true,
					"crossDomain": true,
					"url": "https://community-open-weather-map.p.rapidapi.com/weather?q="+country_Name,
					"method": "GET",
					"headers": {
						"x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
						"x-rapidapi-key": "16de5d848amshe2bd0c0343ad466p12a5e8jsne82ff62a1af7"
					}
				}

				$.ajax(settings_2).done(function (response) {
					//console.log(response);
					//console.log(temp);
					//console.log(response.weather[0].icon);
					weathericon = response.weather[0].icon;
					temp = response.main.temp - 273.15; 
					// Set the weather icon of particular city
					document.getElementById(weatherid).src="http://openweathermap.org/img/wn/"+weathericon+"@2x.png";
				});
	}
	
	// Get user's country
	$.getJSON('https://json.geoiplookup.io/', function(data) {
		var country_code = data.country_code;
		var country_name = data.country_name;
		var currency_code = data.currency_code;
		var city = data.city;
		// Set p values on html page
		document.getElementById("city_country").innerHTML=city+", "+country_name;
		/*
		console.log(country_code);
		console.log(country_name);
		console.log(currency_code);
		console.log(city);
		*/
		
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		
		// Get an array of suuported countries by SkyScanner
		var settings2 = {
			"async": true,
			"crossDomain": true,
			"url": "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/reference/v1.0/countries/en-US",
			"method": "GET",
			"headers": {
				"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
				"x-rapidapi-key": "16de5d848amshe2bd0c0343ad466p12a5e8jsne82ff62a1af7"
			}
		}
		$.ajax(settings2).done(function (response) {
			console.log(response);
			var country_code;
			country_code = response.Countries[countryCodeMapping["Malaysia"]].Code; // Malaysia
			createMainQuote(country_code);
			country_code = response.Countries[countryCodeMapping["Indonesia"]].Code; // Indonesia
			createMainQuote(country_code);
			country_code = response.Countries[countryCodeMapping["Vietnam"]].Code; // Vietnam
			createMainQuote(country_code);
			country_code = response.Countries[countryCodeMapping["Cambodia"]].Code; // Cambodia
			createMainQuote(country_code);
			country_code = response.Countries[countryCodeMapping["Brunei"]].Code; // Brunei
			createMainQuote(country_code);
		});
		
		var quoteArray = $( "#main" ).children();
		console.log(quoteArray);
		
		function createMainQuote(destination_code) {
			// Parse user's location and required inputs into the SkyScanner API
			//console.log("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/"+country_code+"/"+currency_code+"/en-US/"+country_code+"-sky/"+destination_code+"-sky/"+date);
			var settings = {
				"async": true,
				"crossDomain": true,
				"url": "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/"+country_code+"/"+currency_code+"/en-US/"+country_code+"-sky/"+destination_code+"-sky/"+"2019-10-15",
				"method": "GET",
				"headers": {
					"x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
					"x-rapidapi-key": "16de5d848amshe2bd0c0343ad466p12a5e8jsne82ff62a1af7"
				}
			}

			$.ajax(settings).done(function (response) {
				console.log(response)
				SkyScanner_Output = response
							
				// Two ways of getting the minimum flight price of a country
				/* First Option (Get the price only):
				var array = response.Quotes;
				array = Math.min.apply(Math, array.map(function(o) { 
						return o.MinPrice;  
				}))
				console.log(array);
				*/
				/* Second Option (Get the whole quote with the lowest price):
				array = response.Quotes;
				array = JSON.stringify(array.reduce(function(prev, current) { 
						return (prev.MinPrice < current.MinPrice) ? prev : current 
				}));
				console.log(array);
				*/
				
				// Sort all the quotes from lowest flight price to highest price
				var sortedArray = SkyScanner_Output.Quotes.sort(function(a, b){return a.MinPrice-b.MinPrice});
				var mainQuote = document.createElement('div');
				//mainQuote.id = SkyScanner_Output.Places[0].Name;
                mainQuote.id = countryArray[destination_code];
                mainQuote.style.display = 'none';
				document.getElementById("main").appendChild(mainQuote);
				
				var i;
				for (i = 0; i < sortedArray.length; i++){
					// Create quote div
					var div = document.createElement('div');
					div.id = "quote_"+sortedArray[i].QuoteId;
					document.getElementById(countryArray[destination_code]).appendChild(div);
					
					// Create Destination
					var pElem2 = document.createElement('p');
					var destinationId = sortedArray[i].OutboundLeg.DestinationId;
					pElem2.className = destinationId;
					pElem2.style.display = "inline-block";
					var j;
					var countryName;
					var cityName;
					for (j = 0; j < SkyScanner_Output.Places.length; j++){
						if (destinationId == SkyScanner_Output.Places[j].PlaceId){
							cityName = SkyScanner_Output.Places[j].CityName;
							countryName = SkyScanner_Output.Places[j].CountryName;
							pElem2.innerHTML = cityName+ ", " + countryName;
							div.appendChild(pElem2);
							break;
						}
					}
					
					// Create min price
					var pElem = document.createElement('p');
					pElem.className = 'flightPrice_'+i;
					pElem.innerHTML = ' ' + currency_code + ' ' + sortedArray[i].MinPrice + '\n';
					pElem.style.display = "inline-block";
                    div.appendChild(pElem);
        
					
					// Create weather icon if is the minimum
					if (i == 0){
						// Create weather img
						var weatherIcon = document.createElement("IMG");
						weatherIcon.id = 'weather_'+destination_code;
						div.appendChild(weatherIcon);
						getWeather(cityArray[countryArray[destination_code]], "weather_"+destination_code)
					}else{

                    }
				}
			});
		
		}
		
		
		
	});	
	
