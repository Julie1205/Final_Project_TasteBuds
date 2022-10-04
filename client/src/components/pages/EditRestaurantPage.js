import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";


const EditRestaurantPage = () => {
    const location = useLocation();
    const { data } = location.state;
    const INITIAL_STATE = { imageUrl: [...data.imageUrl] };

    const [updatedValues, setUpdatedValues] = useState(INITIAL_STATE);
    const [changeInImageUrl, setChangeInImageUrl] = useState(false);
    const [image, setImage] = useState(null);
    const [submitStatus, setSubmitStatus] = useState(false);
    const [errorStatus, setErrorStatus] =useState(false);

    const { user } = useAuth0();
    const navigate = useNavigate();

    //handles update of restaurant in mongodb
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
                setChangeInImageUrl(false);
                setImage(null);
                setErrorStatus(false);
                setSubmitStatus(true);
            }
            else {
                setErrorStatus(true);
                return Promise.reject(data);
            }
        })
        .catch((err) => console.log(err))
    };

    //handles image upload to cloudinary 
    const handleUploadImage = (imageFile) => {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "rfleb4gq")

        fetch("https://api.cloudinary.com/v1_1/tastebuds32/image/upload", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
                setChangeInImageUrl(true);
                setImage(null);
                setUpdatedValues({
                    ...updatedValues,
                    imageUrl: [...updatedValues.imageUrl, {public_id: data.public_id, url: data.secure_url}]
                })
        })
        .catch((err) => console.log(err))
    };

    //handles removal of image from cloudinary and updateValues array
    const handleDeleteImage = (public_id) => {
        fetch("/delete-image", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({public_id})
            })
        .then(res => res.json())
        .then(result => {
            if(result.status === 201) {
                const imageIndex = updatedValues.imageUrl.findIndex((image) => image.public_id === public_id);
                const newImageUrlArr = [...updatedValues.imageUrl]
                newImageUrlArr.splice(imageIndex, 1);
                setChangeInImageUrl(true);
                setUpdatedValues({
                    ...updatedValues,
                    imageUrl: newImageUrlArr
                })
            }
            else {
                return Promise.reject(result)
            }
        })
        .catch((err) => console.log(err))
    }

    //handles re-uploading initial images if user cancels edit
    const handleCancelUpdate = () => {
        const images = [...data.imageUrl]
    }

    return (
        <div>
            {!submitStatus   
            ? <>
                <p>{`Editing restaurant: ${data.restaurantName}`}</p>
                <label>
                    Restaurant Name:
                    <input
                        required
                        value={
                            updatedValues.restaurantName !== undefined
                            ? updatedValues.restaurantName 
                            : data.restaurantName
                        }
                        onChange={(e) => setUpdatedValues({
                            ...updatedValues, 
                            restaurantName: e.target.value
                        })}
                    />
                </label>
                <label>
                    Restaurant Address:
                    <input
                        value={
                            updatedValues.restaurantAddress !== undefined
                            ? updatedValues.restaurantAddress 
                            : data.restaurantAddress
                        }
                        onChange={(e) => setUpdatedValues({
                            ...updatedValues, 
                            restaurantAddress: e.target.value
                        })}
                    />
                </label>
                <label>
                    Restaurant Phone number:
                    <input 
                        value={
                            updatedValues.restaurantPhoneNumber !== undefined
                            ? updatedValues.restaurantPhoneNumber 
                            : data.restaurantPhoneNumber
                        }
                        onChange={(e) => setUpdatedValues({
                            ...updatedValues,
                            restaurantPhoneNumber: e.target.value
                        })}
                    />
                </label>
                <label>
                    Restaurant website:
                    <input 
                        value={
                            updatedValues.restaurantWebsite !== undefined
                            ? updatedValues.restaurantWebsite 
                            : data.restaurantWebsite
                        }
                        onChange={(e) => setUpdatedValues({
                            ...updatedValues,
                            restaurantWebsite: e.target.value
                        })}
                    />
                </label>
                <label>
                    Restaurant cusine:
                    <input 
                        value={
                            updatedValues.restaurantCuisine !== undefined
                            ? updatedValues.restaurantCuisine 
                            : data.restaurantCuisine
                        }
                        onChange={(e) => setUpdatedValues({
                            ...updatedValues,
                            restaurantCuisine: (e.target.value).trim().charAt(0).toLocaleUpperCase() + (e.target.value).toLocaleLowerCase().slice(1)
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
                            disabled={
                                updatedValues.restaurantVisitStatus === false 
                                || updatedValues.restaurantVisitStatus === undefined
                            }
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
                            disabled={
                                updatedValues.restaurantVisitStatus === false 
                                || updatedValues.restaurantVisitStatus === undefined
                            }
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
                            disabled={
                                updatedValues.restaurantVisitStatus === false 
                                || updatedValues.restaurantCategory === "disliked" 
                                || updatedValues.restaurantCategory === undefined
                            }
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
                            disabled={
                                updatedValues.restaurantVisitStatus === false 
                                || updatedValues.restaurantCategory === "disliked" 
                                || updatedValues.restaurantCategory === undefined
                            }
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
                            value={
                                updatedValues.restaurantComment 
                                ? updatedValues.restaurantComment 
                                : data.restaurantComment
                            }
                            onChange={(e) => setUpdatedValues({
                                ...updatedValues,
                                restaurantComment: e.target.value
                            })}
                        />
                    </label>
                </div>
                <div>
                    <p>Add pictures? You can add up to 3 images</p>
                    <div>
                        <input 
                            disabled={
                                updatedValues.imageUrl && updatedValues.imageUrl.length === 3
                                ? true 
                                : data.imageUrl.length === 3
                            }
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                        <button 
                            disabled={
                                updatedValues.imageUrl && updatedValues.imageUrl.length === 3
                                ? true 
                                : data.imageUrl.length === 3
                            }
                            onClick={() => handleUploadImage(image)}
                        >
                            add Image
                        </button>
                        {updatedValues.imageUrl.length > 0
                        ? <div>
                                <p>Current pictures</p>
                                {updatedValues.imageUrl.map((image) => {
                                    return (
                                        <div key={image.public_id}>
                                            <img  src={image.url} alt="image uploaded"/>
                                            <button onClick={ () => {
                                                handleDeleteImage(image.public_id);
                                            }}>
                                                Delete
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        : null
                        }
                    </div>
                </div>
                <button 
                    onClick={handleSubmit}
                    disabled={
                        updatedValues.restaurantName === "" 
                        || (Object.keys(updatedValues).length === 1 && changeInImageUrl === false)
                    }
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