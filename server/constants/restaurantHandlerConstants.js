const FILTERED_CATEGORIES = [
    "Been_To", 
    "Liked", 
    "Disliked", 
    "Favorite", 
    "Wish_List"
];

const FILTERED_CATEGORIES_ASSOCIATED_VALUE = [
    [ "restaurantVisitStatus", true ],
    [ "restaurantCategory", "liked" ],
    [ "restaurantCategory", "disliked" ],
    [ "restaurantFavorite", true ],
    [ "restaurantVisitStatus", false ]
];

const UPDATABLE_FIELDS = [
    "restaurantName",
    "restaurantAddress",
    "restaurantPhoneNumber",
    "restaurantWebsite",
    "restaurantVisitStatus",
    "restaurantCategory",
    "restaurantFavorite",
    "restaurantCuisine",
    "restaurantComment",
    "imageUrl"
];

module.exports = { 
    FILTERED_CATEGORIES, 
    FILTERED_CATEGORIES_ASSOCIATED_VALUE, 
    UPDATABLE_FIELDS 
};