import { Outlet, NavLink } from "react-router-dom";

const MyRestaurantsPage = () => {
    return (
        <div>
            <p>My Restaurants</p>
            <div>
                <NavLink to={"all"}>All</NavLink>
                <NavLink to={"beenTo"}>Been To</NavLink>
                <NavLink to={"liked"}>Liked</NavLink>
                <NavLink to={"disliked"}>Disliked</NavLink>
                <NavLink to={"favorite"}>Favorite</NavLink>
                <NavLink to={"want"}>Want to go to</NavLink>
            </div>
            <Outlet/>
        </div>
    );
};

export default MyRestaurantsPage;