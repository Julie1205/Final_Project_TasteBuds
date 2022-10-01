import styled from "styled-components";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const INITIAL_STATE = {
    restaurantName: "",
    restaurantAddress: "",
    restaurantPhoneNumber: "",
    restaurantWebsite: "",
    restaurantVisitStatus: false,
    restaurantCategory: "",
    restaurantFavorite: true,
    restaurantComment: ""
}

const AddRestaurantPage = () => {
    const [newRestaurantInfo, setNewRestaurantInfo] = useState(INITIAL_STATE);
    const [submitStatus, setSubmitStatus] = useState(false);
    const [errorStatus, setErrorStatus] =useState(false);
    const { user } = useAuth0();
    const location = useLocation();

    useEffect(() => {
        if(location.state) {
            const { data } = location.state;

            setNewRestaurantInfo({
                ...newRestaurantInfo,
                restaurantName: data.name,
                restaurantAddress: data.address,
                restaurantPhoneNumber: data.phone_number ? data.phone_number : "",
                restaurantWebsite: data.website ? data.website : ""
            })
        }
    }, [])

    const handleSubmit = () => {
        setErrorStatus(false);

        fetch(`/add-restaurant/${user.email}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(newRestaurantInfo)
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === 201) {
                setNewRestaurantInfo(INITIAL_STATE);
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
        <Wrapper>
            {!submitStatus 
            ? <>
                <div>
                    <InputSection>
                        <p>Add a Restaurant</p>
                        <label>
                            Restaurant Name:
                            <input
                                required
                                placeholder="O noir"
                                value={newRestaurantInfo.restaurantName}
                                onChange={(e) => setNewRestaurantInfo({
                                    ...newRestaurantInfo, 
                                    restaurantName: e.target.value
                                })}
                            />
                        </label>
                        <label>
                            Restaurant Address:
                            <input
                                placeholder="124 Rue Prince Arthur East, Montreal QC H2X 1B5"
                                value={newRestaurantInfo.restaurantAddress}
                                onChange={(e) => setNewRestaurantInfo({
                                    ...newRestaurantInfo, 
                                    restaurantAddress: e.target.value
                                })}
                            />
                        </label>
                        <label>
                            Restaurant Phone number:
                            <input 
                                placeholder="+1-514-937-9727"
                                value={newRestaurantInfo.restaurantPhoneNumber}
                                onChange={(e) => setNewRestaurantInfo({
                                    ...newRestaurantInfo,
                                    restaurantPhoneNumber: e.target.value
                                })}
                            />
                        </label>
                        <label>
                            Restaurant website:
                            <input 
                                placeholder="www.onoir.com"
                                value={newRestaurantInfo.restaurantWebsite}
                                onChange={(e) => setNewRestaurantInfo({
                                    ...newRestaurantInfo,
                                    restaurantWebsite: e.target.value
                                })}
                            />
                        </label>
                    </InputSection>
                    <div>
                        <p>Have you been to this restaurant?</p>
                        <label>
                            <input 
                                type="radio"
                                name="visitSate"
                                value={true}
                                checked={newRestaurantInfo.restaurantVisitStatus === true}
                                onChange={(e) => setNewRestaurantInfo({
                                    ...newRestaurantInfo, 
                                    restaurantVisitStatus: true
                                })}
                            />
                            yes
                        </label>
                        <label>
                            <input 
                                type="radio"
                                name="visitSate"
                                value={false}
                                checked={newRestaurantInfo.restaurantVisitStatus === false}
                                onChange={(e) => setNewRestaurantInfo({
                                    ...newRestaurantInfo, 
                                    restaurantVisitStatus: false,
                                    restaurantFavorite: INITIAL_STATE.restaurantFavorite
                                })}
                            />
                            no
                        </label>
                    </div>
                    {newRestaurantInfo.restaurantVisitStatus 
                    ? <div>
                        <p>What did you think about the restaurant?</p>
                        <label>
                            <input
                                type="radio"
                                name="category"
                                value="liked"
                                checked={newRestaurantInfo.restaurantCategory === "liked"}
                                onChange={(e) => setNewRestaurantInfo({
                                    ...newRestaurantInfo,
                                    restaurantCategory: e.target.value
                                })}
                            />
                            Liked
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="category"
                                value="disliked"
                                checked={newRestaurantInfo.restaurantCategory === "disliked"}
                                onChange={(e) => setNewRestaurantInfo({
                                    ...newRestaurantInfo, 
                                    restaurantCategory: e.target.value,
                                    restaurantFavorite: INITIAL_STATE.restaurantFavorite
                                })}
                            />
                            Disliked
                        </label>
                    </div>
                    : null}
                    {newRestaurantInfo.restaurantVisitStatus && newRestaurantInfo.restaurantCategory === "liked"
                    ? <div>
                        <p>Would you like to add restaurant to favorites?</p>
                        <label>
                            <input
                                type="radio"
                                name="favoriteStatus"
                                value={true}
                                checked={newRestaurantInfo.restaurantFavorite === true}
                                onChange={(e) => setNewRestaurantInfo({
                                    ...newRestaurantInfo, 
                                    restaurantFavorite: true
                                })}
                            />
                            yes
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="favoriteStatus"
                                value={false}
                                checked={newRestaurantInfo.restaurantFavorite === false}
                                onChange={(e) => setNewRestaurantInfo({
                                    ...newRestaurantInfo,
                                    restaurantFavorite: false
                                })}
                            />
                            no
                        </label>
                    </div>
                    : null}
                    <div>
                        <label>
                            Comments about the restaurant:
                            <textarea
                                value={newRestaurantInfo.restaurantComment}
                                onChange={(e) => setNewRestaurantInfo({
                                    ...newRestaurantInfo,
                                    restaurantComment: e.target.value
                                })}
                            />
                        </label>
                    </div>
                </div>
                <button 
                    onClick={handleSubmit}
                    disabled={newRestaurantInfo.restaurantName === ""}
                >
                    Submit
                </button>
            </>
            : <p>Restaurant Added!</p>}
            {errorStatus ? <p>Failed to add restaurant. Please try again.</p> : null}
        </Wrapper>
    );
};

export default AddRestaurantPage;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 75vw;
    font-size: var(--body-font);
    margin-top: var(--offset-top);
`;

const InputSection = styled.div`
    display: flex;
    flex-direction: column;
`;