import { useParams } from "react-router-dom";

const RestaurantsByCategoryPage = () => {
    const { category } = useParams();

    return (
        <p>{`${category.replace("_", " ")} Restaurants`}</p>
    )
};

export default RestaurantsByCategoryPage;