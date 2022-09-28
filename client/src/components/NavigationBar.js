import { Link } from "react-router-dom";

const NavigationBar = () => {
    return (
        <nav>
            <Link to="/home">Home</Link>
            <Link to="myRestaurants">My Saved Restaurants</Link>
            <Link to="AddRestaurant">Add a Restaurant</Link>
        </nav>
    );
};

export default NavigationBar;