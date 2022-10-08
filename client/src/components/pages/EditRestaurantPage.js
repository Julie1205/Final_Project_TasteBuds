import styled from "styled-components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { IoIosAddCircle } from "react-icons/io";
import CircularProgress from '@mui/material/CircularProgress';

const INITIAL_STATE = {};
const INITIAL_STATE_IMAGES_ADDED = [];
const INITIAL_STATE_IMAGES_DELETED = [];

const EditRestaurantPage = () => {
    const location = useLocation();
    const { data, path } = location.state;
    const { user } = useAuth0();
    const { id } = useParams();

    const [updatedValues, setUpdatedValues] = useState(INITIAL_STATE);
    const [changeInImageUrl, setChangeInImageUrl] = useState(false);
    const [image, setImage] = useState(null);
    const [newImageUrlArr, setNewImageUrlArr] = useState(data.imageUrl);
    const [imageAddedArr, setImageAddedArr] = useState(INITIAL_STATE_IMAGES_ADDED);
    const [imageDeletedArr, setImageDeletedArr] = useState(INITIAL_STATE_IMAGES_DELETED);
    const [uploadStatus, setUploadStatus] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(false);
    const [errorStatus, setErrorStatus] =useState(false);
    const [imageUploadError, setImageUploadError] = useState(false);
    const [imageTypeError, setImageTypeError] = useState(false);

    const navigate = useNavigate();

    //function to add image file to newImageUrlArr and imageAddedArr
    //imageAddedArr is used to track what are the new images to be added to cloudinary when submitted
    const addImage =(imageFile) => {
        const fileExtensionIndex = image.name.lastIndexOf(".") + 1;
        const fileExtension = image.name.slice(fileExtensionIndex).toLocaleLowerCase();
        if(fileExtension === "jpg" || fileExtension === "jpeg" || fileExtension === "png") {
            setNewImageUrlArr([...newImageUrlArr, imageFile]);
            setImageAddedArr([...imageAddedArr, imageFile]);
            setChangeInImageUrl(true);
        }
        else {
            setImageTypeError(true);
        }
    };
    
    //function to remove image files or cloudinary links from newImageUrlArr and imageDeleteArr
    //if the image's identifier is a string, the cloudinary link, it is added to the imageDeletedArr
    //imageDeletedArr is used to track what images need to be removed from cloudinary when submitted
    const removeImage =(imageIdentifier) => {
        setChangeInImageUrl(true);

        if(typeof(imageIdentifier) === "string") {
            setImageDeletedArr([...imageDeletedArr, imageIdentifier]);
            const imageIndex = newImageUrlArr.findIndex((image) => image.public_id === imageIdentifier);
            const updatedImageUrlArr = [...newImageUrlArr];
            updatedImageUrlArr.splice(imageIndex, 1);
            setNewImageUrlArr(updatedImageUrlArr);
        }
        else {
            const imageFileIndex = newImageUrlArr.findIndex((image) => {
                return image.name === newImageUrlArr.name && image.lastModified === newImageUrlArr.lastModified
            });
            
            const updatedImageUrlArr = [...newImageUrlArr];
            updatedImageUrlArr.splice(imageFileIndex, 1);
            setNewImageUrlArr(updatedImageUrlArr);
            URL.revokeObjectURL(imageIdentifier);
        } 
    };
    //create upload image to Cloudinary promises 
    const handleUploadImageToCloudinary = (imageFile) => {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "rfleb4gq")
        
        return fetch("https://api.cloudinary.com/v1_1/tastebuds32/image/upload", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if(data.public_id) {
                URL.revokeObjectURL(imageFile);
                return {public_id: data.public_id, url: data.secure_url};
            }
            else {
                setImageUploadError(true);
                return Promise.reject(data);
            }
        })
        .catch((err) => console.log(err))
    };

    //create delete image from cloudinary promises
    const handleDeleteImageFromCloudinary = (public_id) => {
        return fetch("/delete-image", {
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
                return "success"
            }
            else {
                return Promise.reject(result);
            }
        })
        .catch((err) => console.log(err))
    }

    //handles update of restaurant in mongodb
    //resolves delete promises and upload promises for changes in cloudinary
    //then updates restaurant in mongodb
    const handleSubmit = (ev) => {
        ev.preventDefault();
        setUploadStatus(true);
        setErrorStatus(false);

        if(changeInImageUrl) {
            const cloudinaryDeletePromises = imageDeletedArr.map((image) => {
                return handleDeleteImageFromCloudinary(image);
            });

            Promise.all(cloudinaryDeletePromises)
            .then(deleteResult => {
                if(Array.isArray(deleteResult)) {
                    const cloudinaryUploadPromises = imageAddedArr.map((imageAdded) => {
                        return handleUploadImageToCloudinary(imageAdded);
                    });
                    Promise.all(cloudinaryUploadPromises)
                    .then(uploadResults => {
                        if(Array.isArray(uploadResults)) {
                            const oldImagesArr = newImageUrlArr.filter((image) => {
                                return image.public_id !== undefined
                            });

                            let newImagesArr = [...uploadResults];

                            if(uploadResults.includes(undefined)){
                                newImagesArr = uploadResults.filter((newImage) => {
                                    return newImage !== undefined;
                                })
                            }

                            fetch(`/update-restaurant/${user.email}`, {
                                method: "PATCH",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Accept": "application/json"
                                },
                                body: JSON.stringify({
                                    ...updatedValues, 
                                    _id: data._id,
                                    imageUrl: [...oldImagesArr, ...newImagesArr]
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
                                    setUploadStatus(false);
                                    setErrorStatus(true);
                                    return Promise.reject(data);
                                }
                            })
                            .catch((err) => console.log(err))
                        }
                        else {
                            setErrorStatus(true);
                            return Promise.reject(uploadResults);
                        }
                    })
                    .catch((err) => console.log(err))
                }
                else {
                    setErrorStatus(true);
                    return Promise.reject(deleteResult);
                }
            })
            .catch((err) => console.log(err))
        }
        else {
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
        }
    };

    return (
        <Wrapper>
            <PageTitle>
                <span>Editing restaurant: </span>
                <RestaurantEditing>{data.restaurantName}</RestaurantEditing>
            </PageTitle>
            { !submitStatus && !uploadStatus  
            ? <div>
                <FormSection>
                    <InputSection>
                        <label>
                            Restaurant Name:
                            <NameInput
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
                            <AddressInput
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
                            <PhoneNumberInput 
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
                            <WebsiteInput 
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
                            Restaurant cusine/type:
                            <CuisineInput 
                                value={
                                    updatedValues.restaurantCuisine !== undefined
                                    ? updatedValues.restaurantCuisine 
                                    : data.restaurantCuisine
                                }
                                onChange={(e) => setUpdatedValues({
                                    ...updatedValues,
                                    restaurantCuisine: (e.target.value).trim().charAt(0).toLocaleUpperCase() 
                                    + (e.target.value).toLocaleLowerCase().slice(1)
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
                            </VisitStatusAnswer>
                        </VisitStatusQuestion>
                        <LikeOrDislikeQUestion>
                            <p>What did you think about the restaurant?</p>
                            <LikeOrDislikeAnswer>
                                <label>
                                    <input
                                        disabled={
                                            updatedValues.restaurantVisitStatus === false 
                                            || (updatedValues.restaurantVisitStatus === undefined && data.restaurantVisitStatus === false)
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
                                            || (updatedValues.restaurantVisitStatus === undefined && data.restaurantVisitStatus === false)
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
                            </LikeOrDislikeAnswer>
                        </LikeOrDislikeQUestion>
                        <FavoriteQuestion>
                            <p>Would you like to add restaurant to favorites?</p>
                            <FavoriteAnswer>
                                <label>
                                    <input
                                        disabled={
                                            updatedValues.restaurantVisitStatus === false 
                                            || updatedValues.restaurantCategory === "disliked" 
                                            || (updatedValues.restaurantCategory === undefined 
                                                && (data.restaurantCategory === "disliked" || data.restaurantVisitStatus === false))
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
                                            || (updatedValues.restaurantCategory === undefined 
                                                && (data.restaurantCategory === "disliked" || data.restaurantVisitStatus === false))
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
                            </FavoriteAnswer>
                        </FavoriteQuestion>
                    </QuestionSection>
                    <div>
                        <label>
                            Comments about the restaurant:
                            <CommentInput
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
                        <p>Add pictures?</p>
                        <PictureInstruction>{`(You can add up to 3 images of format JPEG, JPG or PNG)`}</PictureInstruction>
                        {imageTypeError 
                        ? <ImageTypeErrorMessage>Only images of type JPEG, JPG or PNG are allowed.</ImageTypeErrorMessage> 
                        : null}
                        <PictureSection>
                            {newImageUrlArr.length < 3 ?
                                <>
                                    <ChooseFileBtn 
                                        disabled={ newImageUrlArr.length === 3 }
                                        type="file" 
                                        accept="image/png, image/jpeg"
                                        onChange={(e) => {
                                            setImageTypeError(false);
                                            setImage(e.target.files[0])
                                        }}
                                    />
                                    <AddImageBtn 
                                        disabled={ 
                                            newImageUrlArr.length === 3
                                        }
                                        onClick={() => addImage(image)}
                                    >
                                        <AddImageText>Add Image</AddImageText>
                                        <AddImageIcon><IoIosAddCircle/></AddImageIcon>
                                    </AddImageBtn>
                                </> 
                            : null}

                            {newImageUrlArr.length > 0
                            ? <>
                                <CurrentPictureTitle>Current pictures</CurrentPictureTitle>
                                <UploadedImagesSection>
                                    { newImageUrlArr.map((image, index) => {
                                        if(image.url !== undefined) {
                                            return (
                                                <ImageWrapper key={ image.public_id }>
                                                    <UploadedImage  src={ image.url } alt="image uploaded"/>
                                                    <DeleteImageBtn onClick={ () => {
                                                        removeImage(image.public_id);
                                                    }}>
                                                        X
                                                    </DeleteImageBtn>
                                                </ImageWrapper>
                                            )
                                        }
                                        else {
                                            return (
                                                <ImageWrapperUrl key={ image.name + index }>
                                                    <UploadedImageUrl  src={ URL.createObjectURL(image) } alt={ image.name }/>
                                                    <DeleteImageUrlBtn onClick={ () => removeImage(image) }>
                                                        X
                                                    </DeleteImageUrlBtn>
                                                </ImageWrapperUrl>
                                            )
                                        }
                                    })}
                                </UploadedImagesSection>
                            </>
                            : null
                            }
                        </PictureSection>
                    </div>
                </FormSection>

                {errorStatus 
                ? <ErrorMessage>Failed to update restaurant. Please try again.</ErrorMessage> 
                : null}

                <div>
                    <SubmitBtn 
                        onClick={ handleSubmit }
                        disabled={
                            updatedValues.restaurantName === "" 
                            || (Object.keys(updatedValues).length === 0 && changeInImageUrl !== true)
                        }
                    >
                        Submit
                    </SubmitBtn>
                    <CancelBtn 
                        onClick={ () => navigate(`/home/restaurant/${id}`, { state: { path } }) }
                    >
                        Cancel
                    </CancelBtn>
                </div>
            </div>
            : uploadStatus && submitStatus 
            ? <div>
                <SuccessMessage>Restaurant Info Updated</SuccessMessage>
                {imageUploadError 
                ? <UploadImageErrorMessage>
                    An error occurred. Some images were not uploaded properly.
                </UploadImageErrorMessage>
                : null
                }
                <BackBtn onClick={ () => navigate(-1) }>Back</BackBtn>
            </div>
            : (
                <LoadingSection>
                    <CircularProgress />
                </LoadingSection>
            )}
        </Wrapper>
    )
};

export default EditRestaurantPage;

const Wrapper = styled.div`
    font-size: 1.1rem;
    display: flex;
    flex-direction: column;
    margin: var(--offset-top) 20px;
    font-family: var(--body-font);
`;

const PageTitle = styled.p`
    font-size: 2rem;
`;

const RestaurantEditing = styled.span`
    font-weight: bold;
`
const UploadedImage = styled.img`
    max-height: 150px;
    margin: 0 5px;
`;

const UploadedImageUrl = styled(UploadedImage)`
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

const DeleteImageUrlBtn = styled(DeleteImageBtn)`
`;

const ImageWrapper = styled.div`
    position: relative;
`;

const ImageWrapperUrl = styled(ImageWrapper)`
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
        };
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
    };

    &:disabled {
        cursor: not-allowed;
    };

    @media (max-width: 850px) {
        border: none;
        color: #0c5a2a;
        background-color: transparent;
        padding: 0 5px;

        &:hover {
            border: none;
            color: #0c5a4a;
        };
    };
`;

const AddImageText = styled.span`
    @media (max-width: 850px) {
        display: none;
    };
`;

const AddImageIcon = styled.span`
    display: none;

    @media (max-width: 850px) {
        display: inline;
        position: relative;
        top: 5px;
        font-size: 1.2rem;
    };
`;

const PictureInstruction = styled.p`
    font-size: 1rem;
`;

const PictureSection = styled.div`
    margin: 20px 0;
`;

const CurrentPictureTitle = styled.p`
    margin-bottom: 10px;
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

const InputSection = styled.div`
    display: flex;
    flex-direction: column;
    padding-bottom: 15px;
    margin: 15px 0;
    border-bottom: 1px solid #e6e6e6;
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

    @media (max-width: 850px) {
        width: 75%;
    };
`;

const ErrorMessage = styled.p`
    margin: 15px 0;
    color: red;
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
    };

    &:disabled {
        cursor: not-allowed;
    };
`;

const CancelBtn = styled.button`
    font-family: var(--body-font);
    font-size: 1.1rem;
    padding: 5px 10px;
    border: 1px solid #990000;
    border-radius: 10px;
    background-color: #990000;
    color: white;
    margin-left: 15px;

    &:hover {
        cursor: pointer;
        border: 1px solid #990000;
        background-color: transparent;
        color: #990000;
    };

    &:active {
        transform: scale(0.85);
    };
`;

const LoadingSection = styled.div`
    position: absolute;
    left: 50%;
    top: 25%;
`;

const BackBtn = styled.button`
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
    };
`;

const SuccessMessage = styled.p`
    margin: 15px 0;
`;

const UploadImageErrorMessage = styled(ErrorMessage)`
`;

const ImageTypeErrorMessage = styled(ErrorMessage)`
`;