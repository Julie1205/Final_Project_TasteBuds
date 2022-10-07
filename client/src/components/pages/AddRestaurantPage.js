import styled from "styled-components";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { IoIosAddCircle } from "react-icons/io";
import CircularProgress from '@mui/material/CircularProgress';

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
    const [imagesToUpload, setImagesToUpload] = useState(INITIAL_STATE_FOR_IMAGES_TO_UPLOAD);
    const [submitStatus, setSubmitStatus] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(false);
    const [errorStatus, setErrorStatus] = useState(false);
    const [imageTypeError, setImageTypeError] = useState(false);
    const [newRestaurantId, setNewRestaurantId] = useState("");
    const { user } = useAuth0();
    const location = useLocation();
    const navigate = useNavigate();

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
        const fileExtensionIndex = image.name.lastIndexOf(".") + 1;
        const fileExtension = image.name.slice(fileExtensionIndex).toLocaleLowerCase();
        if(fileExtension === "jpg" || fileExtension === "jpeg" || fileExtension === "png") {
            setImagesToUpload([...imagesToUpload, image]);
        }
        else {
            setImageTypeError(true);
        }
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
        setUploadStatus(true);
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
                            setNewRestaurantId(data.data);
                            setImage(null);
                            setImagesToUpload(INITIAL_STATE_FOR_IMAGES_TO_UPLOAD)
                            setNewRestaurantInfo(INITIAL_STATE);
                            setSubmitStatus(true);
                        }
                        else {
                            setUploadStatus(false);
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
                    setNewRestaurantId(data.data);
                    setSubmitStatus(true);
                }
                else {
                    setErrorStatus(true);
                    return Promise.reject(data);
                }
            })
            .catch((err) => {
                setUploadStatus(false);
                setErrorStatus(true);
                console.log(err)
            })
        }
    };

    return (
        <Wrapper>
            <PageTitle>Add a Restaurant</PageTitle>
            {!submitStatus && !uploadStatus
            ? <div>
                <FormSection>
                    <InputSection>
                        <label>
                            Restaurant Name
                            <NameInput
                                required
                                placeholder="Example: O noir"
                                value={newRestaurantInfo.restaurantName}
                                onChange={(e) => setNewRestaurantInfo({
                                    ...newRestaurantInfo, 
                                    restaurantName: e.target.value
                                })}
                            />
                        </label>
                        <label>
                            Restaurant Address
                            <AddressInput
                                placeholder="Example: 124 Rue Prince Arthur East, Montreal QC H2X 1B5"
                                value={newRestaurantInfo.restaurantAddress}
                                onChange={(e) => setNewRestaurantInfo({
                                    ...newRestaurantInfo, 
                                    restaurantAddress: e.target.value
                                })}
                            />
                        </label>
                        <label>
                            Restaurant Phone number
                            <PhoneNumberInput 
                                placeholder="Example: +1-514-937-9727"
                                value={newRestaurantInfo.restaurantPhoneNumber}
                                onChange={(e) => setNewRestaurantInfo({
                                    ...newRestaurantInfo,
                                    restaurantPhoneNumber: e.target.value
                                })}
                            />
                        </label>
                        <label>
                            Restaurant website
                            <WebsiteInput 
                                placeholder="Example: www.onoir.com"
                                value={newRestaurantInfo.restaurantWebsite}
                                onChange={(e) => setNewRestaurantInfo({
                                    ...newRestaurantInfo,
                                    restaurantWebsite: e.target.value
                                })}
                            />
                        </label>
                        <label>
                            Restaurant cusine/type
                            <CuisineInput 
                                placeholder="Example: French Cuisine"
                                value={newRestaurantInfo.restaurantCuisine}
                                onChange={(e) => setNewRestaurantInfo({
                                    ...newRestaurantInfo,
                                    restaurantCuisine: ((e.target.value).trim().charAt(0).toLocaleUpperCase() + (e.target.value).toLocaleLowerCase().slice(1)).trim()
                                })}
                            />
                        </label>
                    </InputSection>
                    <QuestionSection>
                        <VisitStatusQuestion>
                            <p>Have you been to this restaurant?</p>
                            <VisitStatusAnswer>
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
                            </VisitStatusAnswer>
                        </VisitStatusQuestion>
                        {newRestaurantInfo.restaurantVisitStatus 
                        ? <LikeOrDislikeQUestion>
                            <p>What did you think about the restaurant?</p>
                            <LikeOrDislikeAnswer>
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
                            </LikeOrDislikeAnswer>
                        </LikeOrDislikeQUestion>
                        : null}
                        {newRestaurantInfo.restaurantVisitStatus && newRestaurantInfo.restaurantCategory === "liked"
                        ? <FavoriteQuestion>
                            <p>Would you like to add restaurant to favorites?</p>
                            <FavoriteAnswer>
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
                            </FavoriteAnswer>
                        </FavoriteQuestion>
                        : null}
                    </QuestionSection>

                    <div>
                        <label>
                            Comments about the restaurant
                            <CommentInput
                                value={newRestaurantInfo.restaurantComment}
                                onChange={(e) => setNewRestaurantInfo({
                                    ...newRestaurantInfo,
                                    restaurantComment: e.target.value
                                })}
                            />
                        </label>
                    </div>

                    <div>
                        <p>Add pictures?</p>
                        <PictureInstruction>{`(You can add up to 3 images of format JPEG, JPG or PNG)`}</PictureInstruction>
                        {imageTypeError 
                        ? <ImageTypeErrorMessage>Only images of type JPEG, JPG or PNG are allowed.</ImageTypeErrorMessage> 
                        : null}
                        <PictureSection>
                            {imagesToUpload.length < 3 ? 
                                <>
                                    <ChooseFileBtn 
                                        disabled={imagesToUpload.length === 3}
                                        type="file" 
                                        accept="image/png, image/jpeg"
                                        onChange={(e) => {
                                            setImageTypeError(false);
                                            setImage(e.target.files[0])
                                        }}
                                    />
                                    <AddImageBtn 
                                        disabled={
                                            imagesToUpload.length === 3
                                        }
                                        onClick={() => AddToImageUpload()}
                                    >
                                        <AddImageText>Add Image</AddImageText>
                                        <AddImageIcon><IoIosAddCircle/></AddImageIcon>
                                    </AddImageBtn>
                                </>
                            : null}
                            {imagesToUpload.length > 0 
                            ? <UploadedImagesSection>
                                {imagesToUpload.map((image, index) => {
                                    return (
                                        <ImageWrapper key={image.name + index}>
                                            <UploadedImage  src={URL.createObjectURL(image)} alt={image.name}/>
                                            <DeleteImageBtn onClick={ () => handleDeleteImage(image)}>
                                                X
                                            </DeleteImageBtn>
                                        </ImageWrapper>
                                    )
                                })}
                            </UploadedImagesSection>
                            : null}
                        </PictureSection>
                    </div>
                </FormSection>

                {errorStatus 
                ? <ErrorMessage>Failed to add restaurant. Please try again.</ErrorMessage> 
                : null}
                
                <SubmitBtn 
                    onClick={handleSubmit}
                    disabled={
                        newRestaurantInfo.restaurantName === "" 
                        || (newRestaurantInfo.restaurantVisitStatus === true 
                            && newRestaurantInfo.restaurantCategory === "")
                    }
                >
                    Submit
                </SubmitBtn>
            </div>
            : uploadStatus && submitStatus
            ? <div>
                <SuccessMessage>
                    Restaurant Added!
                </SuccessMessage>
                <GoToNewRestaurantBtn
                    onClick={() => navigate(`/home/restaurant/${newRestaurantId}`)}
                >
                    Go to new restaurant page
                </GoToNewRestaurantBtn>
                <AddAnotherRestaurantBtn 
                    onClick={() => { 
                        navigate("/home/addRestaurant", {state: null});
                        setUploadStatus(false);
                        setSubmitStatus(false);
                    }}
                >
                    Add another restaurant
                </AddAnotherRestaurantBtn>
            </div>
            : (
                <LoadingSection>
                    <CircularProgress />
                </LoadingSection>
            )}

        </Wrapper>
    );
};

export default AddRestaurantPage;

const Wrapper = styled.div`
    font-size: 1.1rem;
    display: flex;
    flex-direction: column;
    margin: var(--offset-top) 20px;
    font-family: var(--body-font);
`;

const InputSection = styled.div`
    display: flex;
    flex-direction: column;
    padding-bottom: 15px;
    margin: 15px 0;
    border-bottom: 1px solid #e6e6e6;
`;

const PageTitle = styled.p`
    font-size: 2rem;
`;

const FormSection = styled.div`
    margin: 10px 0;
    padding: 20px 40px 40px 30px;
    width: 75%;
    max-width: 1000px;
    border: 1px solid #f0f0f0;
    border-radius: 15px;
    box-shadow: 0 2px 5px #e8e8e8;
    background-color: white;

    @media (max-width: 850px){
        width: 75%;
    }
`;

const NameInput = styled.textarea`
    display: block;
    font-size: 1rem;
    width: 100%;
    margin: 5px 0 10px 0;
    padding: 5px;
    font-weight: normal;
    word-wrap: break-word;
    font-family: var(--body-font);
    resize: none;
    border-color: #d9d9d9;
    border-radius: 5px;
`;

const AddressInput = styled(NameInput)`
    height: auto;
`;

const PhoneNumberInput = styled(NameInput)`
    height: 20px;
`;

const WebsiteInput = styled(NameInput)`
    height: auto;
`;

const CuisineInput = styled(NameInput)`
    height: auto;
`;

const QuestionSection = styled.div`
    padding-bottom: 15px;
    margin: 15px 0;
    border-bottom: 1px solid #e6e6e6;
`;

const VisitStatusQuestion = styled.div`
    margin: 15px 0;
`;

const LikeOrDislikeQUestion = styled(VisitStatusQuestion)`
`;

const FavoriteQuestion = styled(VisitStatusQuestion)`
`;

const VisitStatusAnswer = styled.div`
    margin: 10px 0;
`;

const LikeOrDislikeAnswer = styled(VisitStatusAnswer)`
    margin: 10px 0;
`;

const FavoriteAnswer = styled(VisitStatusAnswer)`
    margin: 10px 0;
`;

const CommentInput = styled(NameInput)`
    min-height: 150px;
`;

const PictureSection = styled.div`
    margin: 20px 0;
`;

const PictureInstruction = styled.p`
    font-size: 1rem;
`;

const SubmitBtn = styled.button`
    font-family: var(--body-font);
    font-size: 1.1rem;
    padding: 5px 10px;
    border: 1px solid #0c5a4a;
    border-radius: 10px;
    background-color: #0c5a4a;
    color: white;

    &:hover {
        cursor: pointer;
        border: 1px solid #0c5a4a;
        background-color: transparent;
        color: #0c5a4a;
    };

    &:active {
        transform: scale(0.85);
    }

    &:disabled {
        cursor: not-allowed;
    }
`;

const ChooseFileBtn = styled.input`
    max-width: 200px;
    border-bottom: 1px dashed #e6e6e6;
    margin-bottom: 10px;

    &::file-selector-button {
        font-family: var(--body-font);
        font-size: 0.90rem;
        padding: 5px 10px;
        border: 1px solid #0c5a4a;
        border-radius: 10px;
        background-color: #0c5a2a;
        color: white;
        margin-left: 5px;
    
        &:hover {
            border: 1px solid #0c5a4a;
            background-color: transparent;
            color: #0c5a4a;
        };
    
        &:active {
            transform: scale(0.85);
        }
    };
`;

const AddImageBtn = styled.button`
    font-family: var(--body-font);
    font-size: 0.90rem;
    padding: 5px 10px;
    border: 1px solid #0c5a4a;
    border-radius: 10px;
    background-color: #0c5a2a;
    color: white;
    margin-left: 5px;

    &:hover {
        cursor: pointer;
        border: 1px solid #0c5a4a;
        background-color: transparent;
        color: #0c5a4a;
    };

    &:active {
        transform: scale(0.85);
    }

    &:disabled {
        cursor: not-allowed;
    }

    @media (max-width: 850px){
        border: none;
        color: #0c5a2a;
        background-color: transparent;
        padding: 0 5px;

        &:hover {
        border: none;
        color: #0c5a4a;
    };
    }
`;

const AddImageText = styled.span`
    @media (max-width: 850px){
        display: none;
    }
`;

const AddImageIcon = styled.span`
    display: none;

    @media (max-width: 850px){
        display: inline;
        position: relative;
        top: 5px;
        font-size: 1.2rem;
    };
`;

const UploadedImage = styled.img`
    max-height: 150px;
    margin: 0 5px;
`;

const UploadedImagesSection = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const DeleteImageBtn = styled.button`
    position: absolute;
    left: 5px;
    background-color: #b30000;
    color: white;
    border: none;
    font-size: 1rem;
`;

const ImageWrapper = styled.div`
    position: relative;
`;

const AddAnotherRestaurantBtn = styled.button`
    font-family: var(--body-font);
    font-size: 0.95rem;
    padding: 5px 10px;
    border: 1px solid #0c5a4a;
    border-radius: 10px;
    background-color: #0c5a4a;
    color: white;

    &:hover {
        cursor: pointer;
        border: 1px solid #0c5a4a;
        background-color: transparent;
        color: #0c5a4a;
    };

    &:active {
        transform: scale(0.85);
    }
`;

const SuccessMessage = styled.p`
    margin: 15px 0;
`;

const ErrorMessage = styled.p`
    margin: 15px 0;
    color: red;
`;

const LoadingSection = styled.div`
    position: absolute;
    left: 50%;
    top: 25%;
`;

const ImageTypeErrorMessage = styled(ErrorMessage)`
`;

const GoToNewRestaurantBtn = styled(AddAnotherRestaurantBtn)`
    display: block;
    margin-bottom: 10px;
`;
