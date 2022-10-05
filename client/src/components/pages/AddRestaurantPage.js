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
    restaurantFavorite: false,
    restaurantComment: "",
    restaurantCuisine: "",
    imageUrl: []
}

const INITIAL_STATE_FOR_IMAGES_TO_UPLOAD = [];

const AddRestaurantPage = () => {
    const [newRestaurantInfo, setNewRestaurantInfo] = useState(INITIAL_STATE);
    const [image, setImage] = useState(null);
    const [imagesToUpload, setImagesToUpload] = useState(INITIAL_STATE_FOR_IMAGES_TO_UPLOAD)
    const [submitStatus, setSubmitStatus] = useState(false);
    const [errorStatus, setErrorStatus] = useState(false);
    const { user } = useAuth0();
    const location = useLocation();

    //this useEffect is to update the newRestaurantInfo with details from a searched restautant
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

    const AddToImageUpload = () => {
        setImagesToUpload([...imagesToUpload, image]);
    }

    const handleDeleteImage = (imageFile) => {
        const imageIndex = imagesToUpload.findIndex((image) => {
            return image.name === imageFile.name && image.lastModified === imageFile.lastModified
        });
        
        const updatedImagesToUpload = [...imagesToUpload];
        updatedImagesToUpload.splice(imageIndex, 1);

        setImagesToUpload(updatedImagesToUpload);
        URL.revokeObjectURL(imageFile);
    };

    //creates an array of promises to upload images to cloudinary and return data needed to store in Mongodb
    const handleCloudinaryUpload = (imageFile) => {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "rfleb4gq")

        return fetch("https://api.cloudinary.com/v1_1/tastebuds32/image/upload", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            URL.revokeObjectURL(imageFile);
            return {public_id: data.public_id, url: data.secure_url};
        })
        .catch((err) => console.log(err))
    };
    
    //handles adding restaurant to mongodb
    const handleSubmit = () => {
        setErrorStatus(false);
        if(imagesToUpload.length > 0) {
            const cloudinaryUploadPromises = imagesToUpload.map((image) => {
                return handleCloudinaryUpload(image);
            });
            Promise.all(cloudinaryUploadPromises)
            .then(result => {
                if(Array.isArray(result)) {
                    fetch(`/add-restaurant/${user.email}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify({...newRestaurantInfo, imageUrl: result})
                    })
                    .then(res => res.json())
                    .then(data => {
                        if(data.status === 201) {
                            setImage(null);
                            setImagesToUpload(INITIAL_STATE_FOR_IMAGES_TO_UPLOAD)
                            setNewRestaurantInfo(INITIAL_STATE);
                            setSubmitStatus(true);
                        }
                        else {
                            setErrorStatus(true);
                            return Promise.reject(data);
                        }
                    })
                }
                else {
                    setErrorStatus(true);
                    return Promise.reject(result);
                }
            })
            .catch((err) => console.log(err))
        }
        else {
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
                    setImage(null);
                    setImagesToUpload(INITIAL_STATE_FOR_IMAGES_TO_UPLOAD)
                    setNewRestaurantInfo(INITIAL_STATE);
                    setSubmitStatus(true);
                }
                else {
                    setErrorStatus(true);
                    return Promise.reject(data);
                }
            })
            .catch((err) => console.log(err))
        }
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
                        <label>
                            Restaurant cusine/type:
                            <input 
                                placeholder="French Cuisine"
                                value={newRestaurantInfo.restaurantCuisine}
                                onChange={(e) => setNewRestaurantInfo({
                                    ...newRestaurantInfo,
                                    restaurantCuisine: ((e.target.value).trim().charAt(0).toLocaleUpperCase() + (e.target.value).toLocaleLowerCase().slice(1)).trim()
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
                <div>
                    <p>Add pictures? You can add up to 3 images</p>
                    <div>
                        <input 
                            disabled={imagesToUpload.length === 3}
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                        <button 
                            disabled={imagesToUpload.length === 3}
                            onClick={() => AddToImageUpload()}
                        >
                            add Image
                        </button>
                        {imagesToUpload.length > 0 
                        ? <div>
                            {imagesToUpload.map((image, index) => {
                                return (
                                    <div key={image.name + index}>
                                        <img  src={URL.createObjectURL(image)} alt={image.name}/>
                                        <button onClick={ () => handleDeleteImage(image)}>
                                            Delete
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                        : null}
                    </div>
                </div>
                <button 
                    onClick={handleSubmit}
                    disabled={
                        newRestaurantInfo.restaurantName === "" 
                        || (newRestaurantInfo.restaurantVisitStatus === true 
                            && newRestaurantInfo.restaurantCategory === "")
                    }
                >
                    Submit
                </button>
            </>
            : <div>
                <p>Restaurant Added!</p>
                <button onClick={() => setSubmitStatus(false)}>Add another restaurant</button>
            </div>
            }
            {errorStatus ? <p>Failed to add restaurant. Please try again.</p> : null}
        </Wrapper>
    );
};

export default AddRestaurantPage;

const Wrapper = styled.div`

`;

const InputSection = styled.div`
    display: flex;
    flex-direction: column;
`;