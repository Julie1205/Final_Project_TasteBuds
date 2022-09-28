import { Outlet, NavLink } from "react-router-dom";

import { CATEGORIES } from "../constants/categories";

const MyRestaurantsPage = () => {
    return (
        <div>
            <p>My Restaurants</p>
            <div>
                {
                    CATEGORIES.map((category) => {
                        return <NavLink to={category}>{category.replace("_", " ")}</NavLink>
                    })
                }
            </div>
            <Outlet/>
        </div>
    );
};

export default MyRestaurantsPage;