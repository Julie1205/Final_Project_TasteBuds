import { Link } from "react-router-dom";

const RestaurantTile = ( { restaurant } ) => {

    return (
        <Link to={`/home/restaurant/${restaurant._id}`} state={ { data: restaurant } }>
            <p>{restaurant.restaurantName}</p>
            <p>{restaurant.restaurantVisitStatus ? "Been To" : "Have not been to"}</p>
            {restaurant.restaurantVisitStatus 
            ? <p>{restaurant.restaurantCategory === "liked" ? "Liked" : "Disliked"}</p> : null}
            {restaurant.restaurantCategory === "liked" && restaurant.restaurantFavorite === true
            ? <p>Favortite</p> : null }
        </Link>
    );
};

export default RestaurantTile;
