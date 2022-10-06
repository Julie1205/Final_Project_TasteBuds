import styled from "styled-components";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { BsArrowLeftShort } from "react-icons/bs";
import { FiMapPin } from "react-icons/fi";
import { HiOutlinePhone } from "react-icons/hi";
import { IoEarthSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { AiFillStar, AiOutlineLike, AiOutlineDislike} from "react-icons/ai";
import EatStatusColor from "../../assets/EatStatusColor.png"
import EatStatusNew from "../../assets/EatStatus_new2.png"

const RestaurantDetailsPage = () => {
    const [restaurantDetails, setRestaurantDetails] = useState(null);
    const [deleteStatus, setDeleteStatus] = useState(false);
    const [errorStatus, setErrorStatus] =useState(false);
    const { id } = useParams();
    const { user } = useAuth0();
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
        <Wrapper>
            <BackBtn 
                onClick={ () => navigate(-1) }
            >
                <BsArrowLeftShort/>
            </BackBtn>
            { restaurantDetails && user && !deleteStatus
            ? <RestaurantSection>
                <HeaderSection>
                    <PageTitle>
                        {restaurantDetails.restaurantName}
                        {restaurantDetails.restaurantVisitStatus === true 
                        ? <EatenIcon src={EatStatusColor} alt="Icon for eaten"/>
                        : <NewPlaceIcon src={EatStatusNew} alt="Icon for not eaten" />
                        }
                        {restaurantDetails.restaurantCategory 
                        ? restaurantDetails.restaurantCategory === "liked"
                        ? <LikeIcon>
                            <AiOutlineLike/>
                            </LikeIcon> 
                        : <DislikeIcon>
                            <AiOutlineDislike/>
                        </DislikeIcon> 
                        : null
                        }
                        {restaurantDetails.restaurantFavorite 
                        ? <FavoriteIcon>
                            <AiFillStar/>
                        </FavoriteIcon> 
                        : null
                        }
                    </PageTitle>
                    <EditAndDeleteIcons>
                        <EditLink 
                            to={`/home/restaurant/edit/${ restaurantDetails._id }`} 
                            state={ { data: restaurantDetails } }
                        >
                            <MdEdit />
                        </EditLink>
                        <DeleteBtn 
                            onClick={handleDelete}
                        >
                            <RiDeleteBin5Fill />
                        </DeleteBtn>
                    </EditAndDeleteIcons>
                </HeaderSection>
                <DetailsSection>
                    {restaurantDetails.restaurantAddress 
                    ? <AddressSection>
                        <PlaceIcon>
                            <FiMapPin />
                        </PlaceIcon>
                        <span>
                            {restaurantDetails.restaurantAddress}
                        </span>
                    </AddressSection> 
                    : null
                    }
                    {restaurantDetails.restaurantPhoneNumber 
                    ? <PhoneSection>
                        <PhoneIcon>
                            <HiOutlinePhone/>
                        </PhoneIcon>
                        <span>
                            {restaurantDetails.restaurantPhoneNumber}
                        </span>
                    </PhoneSection> 
                    : null
                    }
                    {restaurantDetails.restaurantWebsite 
                    ? <WebsiteSection>
                        <WebIcon>
                            <IoEarthSharp/>
                        </WebIcon>
                        <WebsiteText 
                            href={restaurantDetails.restaurantWebsite}                         
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            {restaurantDetails.restaurantWebsite}
                        </WebsiteText> 
                    </WebsiteSection>

                    : null
                    }
                </DetailsSection>

                {restaurantDetails.restaurantCuisine 
                ? <div>
                    <span>Cuisine/Type: </span>
                    <span>{restaurantDetails.restaurantCuisine}</span> 
                </div>
                : null
                }

                
                
                {restaurantDetails.restaurantComment 
                ? <div>
                    <p>What you had to say about this restaurant:</p>
                    <p>{restaurantDetails.restaurantComment}</p>
                </div>
                : null
                }
                {/* {restaurantDetails.imageUrl.length > 0 ?
                    restaurantDetails.imageUrl.map((image) => {
                        return <img  key={image.public_id} src={image.url} alt="image uploaded"/>
                    })
                : null} */}


                {errorStatus ? <p>Could not delete restaurant</p> : null}
            </RestaurantSection>
            : restaurantDetails && user && deleteStatus 
            ? <p>Restaurant Deleted</p>
            : null}
        </Wrapper>
    )

};

export default RestaurantDetailsPage;

const Wrapper = styled.div`
    font-size: 1.1rem;
    display: flex;
    flex-direction: column;
    margin: var(--offset-top) 20px;
    font-family: var(--body-font);
    align-items: flex-start;
`;

const HeaderSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    /* @media (max-width: 850px){
        flex-direction: column;
        align-items: flex-start;
    } */
`;

const EditLink = styled(Link)`
    color: #0c5a4a;
    text-decoration: none;
    margin: 0 10px;
    font-size: 1.1rem;
    position: relative;
    top: 2px;

    /* @media (max-width: 720px){
        top: -5px;
    } */
`;

const DeleteBtn = styled.button`
    color: #0c5a4a;
    font-size: 1.1rem;
    border: none;
    background-color: transparent;
    position: relative;
    top: 2px;

    &:hover {
        cursor: pointer;
    };
`;

const BackBtn = styled.button`
    font-size: 2.1rem;
    border: 1px solid #0c5a4a;
    border-radius: 25%;
    background-color: #0c5a4a;
    color: white;
    margin-bottom: 10px;
    padding: 0;
    display: flex;
    align-items: center;

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

const PageTitle = styled.p`
    font-size: 2rem;
`;

const RestaurantSection = styled.div`
    margin: 10px 0;
    padding: 20px 40px 40px 30px;
    width: 85%;
    max-width: 1000px;
    border: 1px solid #f0f0f0;
    border-radius: 15px;
    box-shadow: 0 2px 5px #e8e8e8;
    background-color: white;
    display: flex;
    flex-direction: column;
`;

const AddressSection = styled.p`
    display: flex;
    align-items: center;
    word-wrap: break-word;
    margin: 5px 0;
`;

const PhoneSection = styled(AddressSection)`
`;

const WebsiteSection = styled(AddressSection)`
`;

const DetailsSection = styled.div`
    border-bottom: 1px solid #e6e6e6;
    padding-bottom: 10px;
    margin-bottom: 10px;
`;

const PlaceIcon = styled.span`
    margin-right: 5px;
`;

const PhoneIcon = styled(PlaceIcon)`
`;

const WebIcon = styled(PlaceIcon)`
`;

const FavoriteIcon = styled.span`
    position: relative;
    top: 2px;
    font-size: 1.7rem;
    margin-left: 5px;
    color: #e6b800;
`;

const EatenIcon = styled.img`
    width: 40px;
    margin-left: 5px;
    position: relative;
    top: 2px;
`;

const NewPlaceIcon = styled(EatenIcon)`
`;

const LikeIcon = styled.span`
    color: #003312;
    margin-left: 5px;
    position: relative;
    top: 2px;
    font-size: 1.7rem;
`;

const DislikeIcon = styled(LikeIcon)`
`;

const EditAndDeleteIcons = styled.div`
`;

const WebsiteText = styled.a`
    word-wrap: break-all; 
`;