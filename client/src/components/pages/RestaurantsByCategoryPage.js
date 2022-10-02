import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const RestaurantsByCategoryPage = () => {
    const [restaurantNames, setRestaurantNames] = useState(null);
    const { category } = useParams();

    useEffect(() => {
        
    }, [category])

    return (
        <p>{`${category.replace("_", " ")} Restaurants`}</p>
    )
};

export default RestaurantsByCategoryPage;