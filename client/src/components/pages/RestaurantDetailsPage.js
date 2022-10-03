import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const RestaurantDetailsPage = () => {
    const [deleteStatus, setDeleteStatus] = useState(false);
    const [errorStatus, setErrorStatus] =useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { data } = location.state;
    const { user } = useAuth0();

    const handleDelete = () => {
        setErrorStatus(false);

        fetch(`/delete-restaurant/${ user.email }`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ _id: data._id })
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === 201) {
                setDeleteStatus(true);
            }
            else {
                setErrorStatus(true);
                return Promise.reject(data);
            }
        })
        .catch((err) => console.log(err))
    };

    return (
        <div>
            <button onClick={ () => navigate(-1) }>Back</button>
            { data && user && !deleteStatus
            ? <>
                <p>{data.restaurantName}</p>
                {data.restaurantAddress ? <p>{data.restaurantAddress}</p> : null}
                {data.restaurantPhoneNumber ? <p>{data.restaurantPhoneNumber}</p> : null}
                {data.restaurantWebsite 
                ? <a 
                    href={data.restaurantWebsite}                         
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    {data.restaurantWebsite}
                </a> 
                : null
                }

                <p>{data.restaurantVisitStatus}</p>
                {data.restaurantCategory ? <p>{data.restaurantCategory}</p> : null}
                {data.restaurantFavorite ? <p>Favorite</p> : null}
                
                {data.restaurantComment ? <p>{data.restaurantComment}</p> : null}
                <Link to={`/home/restaurant/edit/${ data._id }`} state={ { data: data } }>Edit</Link>
                <button onClick={handleDelete}>Delete</button>
                {errorStatus ? <p>Could not delete restaurant</p> : null}
            </>
            : data && user && deleteStatus 
            ? <p>Restaurant Deleted</p>
            : null}
        </div>
    )

};

export default RestaurantDetailsPage;