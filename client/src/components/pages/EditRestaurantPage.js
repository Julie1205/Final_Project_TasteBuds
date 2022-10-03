import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const INITIAL_STATE = {};

const EditRestaurantPage = () => {
    const [updatedValues, setUpdatedValues] = useState(INITIAL_STATE);
    const [submitStatus, setSubmitStatus] = useState(false);
    const [errorStatus, setErrorStatus] =useState(false);
    const location = useLocation();
    const { data } = location.state;
    const { user } = useAuth0();
    const navigate = useNavigate();

    const handleSubmit = () => {
        fetch(`/update-restaurant/${user.email}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                ...updatedValues, 
                _id: data._id
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === 200) {
                setUpdatedValues(INITIAL_STATE);
                setSubmitStatus(true);
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
            {!submitStatus   
            ? <>
                <p>{`Editing restaurant: ${data.restaurantName}`}</p>
                <label>
                    Restaurant Name:
                    <input
                        required
                        value={updatedValues.restaurantName ? updatedValues.restaurantName : data.restaurantName}
                        onChange={(e) => setUpdatedValues({
                            ...updatedValues, 
                            restaurantName: e.target.value
                        })}
                    />
                </label>
                <label>
                    Restaurant Address:
                    <input
                        value={updatedValues.restaurantAddress ? updatedValues.restaurantAddress : data.restaurantAddress}
                        onChange={(e) => setUpdatedValues({
                            ...updatedValues, 
                            restaurantAddress: e.target.value
                        })}
                    />
                </label>
                <label>
                    Restaurant Phone number:
                    <input 
                        value={updatedValues.restaurantPhoneNumber ? updatedValues.restaurantPhoneNumber : data.restaurantPhoneNumber}
                        onChange={(e) => setUpdatedValues({
                            ...updatedValues,
                            restaurantPhoneNumber: e.target.value
                        })}
                    />
                </label>
                <label>
                    Restaurant website:
                    <input 
                        value={updatedValues.restaurantWebsite ? updatedValues.restaurantWebsite : data.restaurantWebsite}
                        onChange={(e) => setUpdatedValues({
                            ...updatedValues,
                            restaurantWebsite: e.target.value
                        })}
                    />
                </label>
                <div>
                    <p>Have you been to this restaurant?</p>
                    <label>
                        <input 
                            type="radio"
                            name="visitSate"
                            value={true}
                            checked={
                                updatedValues.restaurantVisitStatus === true 
                                ? true 
                                : updatedValues.restaurantVisitStatus === false
                                ? false
                                : data.restaurantVisitStatus === true 
                                ? true 
                                : false
                            }
                            onChange={(e) => setUpdatedValues({
                                ...updatedValues, 
                                restaurantVisitStatus: true,
                                restaurantCategory: "liked",
                                restaurantFavorite: true
                            })}
                        />
                        yes
                    </label>
                    <label>
                        <input 
                            type="radio"
                            name="visitSate"
                            value={false}
                            checked={
                                updatedValues.restaurantVisitStatus === false 
                                ? true 
                                : updatedValues.restaurantVisitStatus === true
                                ? false
                                : data.restaurantVisitStatus === false 
                                ? true 
                                : false
                            }
                            onChange={(e) => setUpdatedValues({
                                ...updatedValues, 
                                restaurantVisitStatus: false,
                                restaurantCategory: "",
                                restaurantFavorite: false
                            })}
                        />
                        no
                    </label>
                </div>
                <div>
                    <p>What did you think about the restaurant?</p>
                    <label>
                        <input
                            disabled={updatedValues.restaurantVisitStatus === false}
                            type="radio"
                            name="category"
                            value="liked"
                            checked={
                                updatedValues.restaurantCategory === "liked" 
                                ? true 
                                : updatedValues.restaurantCategory === "disliked" || updatedValues.restaurantCategory === ""
                                ? false
                                : data.restaurantCategory === "liked"
                                ? true
                                : false
                            }
                            onChange={(e) => setUpdatedValues({
                                ...updatedValues,
                                restaurantCategory: e.target.value
                            })}
                        />
                        Liked
                    </label>
                    <label>
                        <input
                            disabled={updatedValues.restaurantVisitStatus === false}
                            type="radio"
                            name="category"
                            value="disliked"
                            checked={
                                updatedValues.restaurantCategory === "disliked" 
                                ? true 
                                : updatedValues.restaurantCategory === "liked" || updatedValues.restaurantCategory === ""
                                ? false
                                : data.restaurantCategory === "disliked"
                                ? true
                                : false
                            }
                            onChange={(e) => setUpdatedValues({
                                ...updatedValues, 
                                restaurantCategory: e.target.value,
                                restaurantFavorite: false
                            })}
                        />
                        Disliked
                    </label>
                </div>
                <div>
                    <p>Would you like to add restaurant to favorites?</p>
                    <label>
                        <input
                            disabled={updatedValues.restaurantVisitStatus === false || updatedValues.restaurantCategory === "disliked"}
                            type="radio"
                            name="favoriteStatus"
                            value={true}
                            checked={
                                updatedValues.restaurantFavorite === true 
                                ? true 
                                : updatedValues.restaurantFavorite === false
                                ? false
                                : data.restaurantFavorite === true
                                ? true
                                : false
                            }
                            onChange={(e) => setUpdatedValues({
                                ...updatedValues, 
                                restaurantFavorite: true
                            })}
                        />
                        yes
                    </label>
                    <label>
                        <input
                            disabled={updatedValues.restaurantVisitStatus === false || updatedValues.restaurantCategory === "disliked"}
                            type="radio"
                            name="favoriteStatus"
                            value={false}
                            checked={
                                updatedValues.restaurantFavorite === false 
                                ? true 
                                : updatedValues.restaurantFavorite === true
                                ? false
                                : data.restaurantFavorite === false
                                ? true
                                : false
                            }
                            onChange={(e) => setUpdatedValues({
                                ...updatedValues,
                                restaurantFavorite: false
                            })}
                        />
                        no
                    </label>
                </div>
                <div>
                    <label>
                        Comments about the restaurant:
                        <textarea
                            value={updatedValues.restaurantComment ? updatedValues.restaurantComment : data.restaurantComment}
                            onChange={(e) => setUpdatedValues({
                                ...updatedValues,
                                restaurantComment: e.target.value
                            })}
                        />
                    </label>
                </div>
                <button 
                    onClick={handleSubmit}
                    disabled={updatedValues.restaurantName === "" || Object.keys(updatedValues).length === 0}
                >
                    Submit
                </button>
                <button onClick={() => navigate(-1)}>Cancel</button>
                </>
                : <p>Restaurant Info Updated</p>}
                {errorStatus ? <p>Failed to update restaurant. Please try again.</p> : null}
        </div>
    )
};

export default EditRestaurantPage;