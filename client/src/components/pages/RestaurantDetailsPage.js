import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const RestaurantDetailsPage = () => {
    const location = useLocation();
    const { data } = location.state;
    
    return (
        <div>
            <p>{data.restaurantName}</p>
            <p>{data.restaurantAddress}</p>
            <p>{data.restaurantPhoneNumber}</p>
            <p>{data.restaurantWebsite}</p>

            <p>{data.restaurantVisitStatus}</p>
            <p>{data.restaurantCategory}</p>
            <p>{data.restaurantFavorite}</p>
            
            <p>{data.restaurantComment}</p>
        </div>
    )

};

export default RestaurantDetailsPage;