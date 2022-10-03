import { useLocation, useNavigate, Link } from "react-router-dom";

const RestaurantDetailsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { data } = location.state;
    console.log(data)
    return (
        <div>
            <button onClick={ () => navigate(-1) }>Back</button>
            { data
            ? <>
                <p>{data.restaurantName}</p>
                {data.restaurantAddress ? <p>{data.restaurantAddress}</p> : null}
                {data.restaurantPhoneNumber ? <p>{data.restaurantPhoneNumber}</p> : null}
                {data.restaurantWebsite ? <p>{data.restaurantWebsite}</p> : null}

                <p>{data.restaurantVisitStatus}</p>
                {data.restaurantCategory ? <p>{data.restaurantCategory}</p> : null}
                {data.restaurantFavorite ? <p>Favorite</p> : null}
                
                {data.restaurantComment ? <p>{data.restaurantComment}</p> : null}
                <Link to={`/home/restaurant/edit/${ data._id }`} state={ { data: data } }>Edit</Link>
            </>
            : null }
        </div>
    )

};

export default RestaurantDetailsPage;