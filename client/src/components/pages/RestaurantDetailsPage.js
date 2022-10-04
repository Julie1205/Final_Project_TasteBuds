import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const RestaurantDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth0();
    const [restaurantDetails, setRestaurantDetails] = useState(null);
    const [deleteStatus, setDeleteStatus] = useState(false);
    const [errorStatus, setErrorStatus] =useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(user) {
            fetch(`/get-restaurant/${ user.email }/${ id }`)
            .then(res => res.json())
            .then(result => {
                if(result.status === 200) {
                    setRestaurantDetails(result.data.restaurants[0]);
                }
                else{
                    return Promise.reject(result)
                    }
            })
            .catch((err) => console.log(err))
        }
    }, [id, user])

    const handleDeleteImageInCloudinary = () => {
        const deletePromises = restaurantDetails.imageUrl.map((image) => {
            return fetch("/delete-image", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify( { public_id: image.public_id } )
            })
            .then(res => res.json())
            .then(result => {
                if(result.status === 201) {
                    return "success"
                }
                else {
                    return Promise.reject(result)
                }
            })
            .catch((err) => console.log(err))
        });
        return(deletePromises);
    };

    const handleDelete = () => {
        setErrorStatus(false);

        fetch(`/delete-restaurant/${ user.email }`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ _id: restaurantDetails._id })
        })
        .then(res => res.json())
        .then(restaurantDeleteResult => {
            if(restaurantDeleteResult.status === 200) {
                if(restaurantDetails.imageUrl.length > 0) {
                    const deletePromises = handleDeleteImageInCloudinary();
                    Promise.all(deletePromises)
                    .then(result => {
                        if(result.includes("success")) {
                            setDeleteStatus(true);
                            return;
                        }
                        else {
                            setErrorStatus(true);
                            return Promise.reject(result);
                        }
                    })
                }
                else {
                    setDeleteStatus(true);
                }
            }
            else {
                setErrorStatus(true);
                return Promise.reject(restaurantDeleteResult);
            }
        })
        .catch((err) => console.log(err))
    };

    return (
        <div>
            <button onClick={ () => navigate(-1) }>Back</button>
            { restaurantDetails && user && !deleteStatus
            ? <>
                <p>{restaurantDetails.restaurantName}</p>
                {restaurantDetails.restaurantCuisine ? <p>{restaurantDetails.restaurantCuisine}</p> : null}
                {restaurantDetails.restaurantAddress ? <p>{restaurantDetails.restaurantAddress}</p> : null}
                {restaurantDetails.restaurantPhoneNumber ? <p>{restaurantDetails.restaurantPhoneNumber}</p> : null}
                {restaurantDetails.restaurantWebsite 
                ? <a 
                    href={restaurantDetails.restaurantWebsite}                         
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    {restaurantDetails.restaurantWebsite}
                </a> 
                : null
                }

                <p>{restaurantDetails.restaurantVisitStatus}</p>
                {restaurantDetails.restaurantCategory ? <p>{restaurantDetails.restaurantCategory}</p> : null}
                {restaurantDetails.restaurantFavorite ? <p>Favorite</p> : null}
                
                {restaurantDetails.restaurantComment ? <p>{restaurantDetails.restaurantComment}</p> : null}
                {restaurantDetails.imageUrl.length > 0 ?
                    restaurantDetails.imageUrl.map((image) => {
                        return <img  key={image.public_id} src={image.url} alt="image uploaded"/>
                    })
                : null}

                <Link to={`/home/restaurant/edit/${ restaurantDetails._id }`} state={ { data: restaurantDetails } }>Edit</Link>
                <button onClick={handleDelete}>Delete</button>
                {errorStatus ? <p>Could not delete restaurant</p> : null}
            </>
            : restaurantDetails && user && deleteStatus 
            ? <p>Restaurant Deleted</p>
            : null}
        </div>
    )

};

export default RestaurantDetailsPage;