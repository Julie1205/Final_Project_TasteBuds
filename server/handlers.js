const fetch = require('node-fetch');
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { TRUEWAY_KEY, MONGO_URI } = process.env;
const { DATABASE_NAME, USERS_COLLECTION } = require("./mongoDbConstants");

const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

//this handler will take the user's address convert it to geo codinates to be used to find restaurants within 200m.
const getRestaurantsNearMe = (req, res) => {
    const { address } = req.params;

    const geoUrl = `https://trueway-geocoding.p.rapidapi.com/Geocode?address=${address}&language=en`;
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
            'X-RapidAPI-Key': '6ac990985cmshf4c3796768b07a4p185a6ajsnbc0c4eae4e89',
            'X-RapidAPI-Host': 'trueway-places.p.rapidapi.com'
        }
        };
        

    fetch(geoUrl, geoOptions)
	.then(res => res.json())
	.then(geoData => {
        if(geoData.results.length === 0 || geoData.results[0].type !== "street_address") {
            Promise.reject(`Status: 400 Body: Address not found`);
        }
        else {
            return `${geoData.results[0].location.lat}%2C${geoData.results[0].location.lng}`
        }
    })
    .then(location => {
        return fetch(
            `https://trueway-places.p.rapidapi.com/FindPlacesNearby?location=${location}&type=restaurant&radius=200&language=en`, 
            placesOptions
        )
    })
    .then(res => res.json())
	.then(data => res.status(200).json({ status: 200, data: data.results}))
	.catch(err => res.status(400).json({status: 400, data: address.replace("%", " "), message: "Adress not found or cannot perform search"}));

};

module.exports = { getRestaurantsNearMe }