import { Link } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";
import { HiOutlinePhone } from "react-icons/hi";
import { IoEarthSharp } from "react-icons/io5";
import { AiFillStar, AiOutlineLike, AiOutlineDislike} from "react-icons/ai";
import EatStatusColor from "../assets/EatStatusColor.png"
import EatStatusNew from "../assets/EatStatus_new2.png"

const RestaurantTile = ( { restaurant } ) => {

    return (
        <Link to={`/home/restaurant/${restaurant._id}`}>
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
