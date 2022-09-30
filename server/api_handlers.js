const fetch = require('node-fetch');

require("dotenv").config();
const { TRUEWAY_KEY } = process.env;

//this handler will take the user's address convert it to geo codinates to be used to find restaurants within 200m.
const getRestaurantsNearMe = (req, res) => {
    const { address } = req.params;

    const geoUrl = encodeURI(`https://trueway-geocoding.p.rapidapi.com/Geocode?address=${address}&language=en`);
    const geoOptions = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': `${TRUEWAY_KEY}`,
        'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com'
    }
    };

    const placesOptions = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': `${TRUEWAY_KEY}`,
            'X-RapidAPI-Host': 'trueway-places.p.rapidapi.com'
        }
        };

    if(address !== "" && typeof(address) === "string") {
        fetch(geoUrl, geoOptions)
        .then(res => res.json())
        .then(geoData => {
            if(geoData.results.length === 0 || geoData.results[0].type !== "street_address") {
                return Promise.reject({status: 404, message: "Address not found"});
            }
            else {
                return `${geoData.results[0].location.lat}%2C${geoData.results[0].location.lng}`
            }
        })
        .then(location => {
            return fetch(
                `https://trueway-places.p.rapidapi.com/FindPlacesNearby?location=${location}&type=restaurant&radius=1000&language=en`, 
                placesOptions
            )
        })
        .then(res => res.json())
        .then(data => res.status(200).json({ status: 200, data: data.results}))
        .catch(err => {
            res.status(err.status).json( { status: err.status, data: address, message: err.message } )
        });
    }
    else {
        res.status(400).json( { status: 400, data: address, message: "Address not valid." } )
    }
};

//this handler will search for a restaurant by name
const findRestaurant = (req, res) => {
    const { restaurantName, city } = req.params;
    const { street } = req.query;

    const query = `${restaurantName} restaurant ${city} ${street}`
    const url = encodeURI(`https://trueway-places.p.rapidapi.com/FindPlaceByText?text=${query}&language=en`);
    console.log(url)
    const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': `${TRUEWAY_KEY}`,
        'X-RapidAPI-Host': 'trueway-places.p.rapidapi.com'
    }
    };
    if(restaurantName !== "" && city !== "" ) {
        fetch(url, options)
            .then(res => res.json())
            .then(searchResults => {
                if(searchResults.results.length === 0) {
                    return Promise.reject( { status: 404, message: "No match found" } );
                }
                else {
                    res.status(200).json( { status: 200, data: searchResults.results } );
                }
            })
            .catch(err => {
                res.status(err.status).json( { status: err.status, data: {restaurantName, city}, message: err.message })
            });
    }
    else {
        res.status(400).json( { status: 400, data: {restaurantName, city}, message: "Missing restaurant name or city." } );
    }
}

module.exports = { getRestaurantsNearMe, findRestaurant }