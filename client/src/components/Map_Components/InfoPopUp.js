import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { AiFillStar, AiOutlineLike, AiOutlineDislike} from "react-icons/ai";
import EatStatusColor from "../../assets/EatStatusColor.png";
import EatStatusNew from "../../assets/EatStatus_new2.png";

const InfoPopUp = ( { restaurant } ) => {
    const navigate = useNavigate();
    const path = useLocation().pathname;

    return (
        <RestaurantLinkBtn 
            onClick={ () => navigate(`/home/restaurant/${ restaurant._id }`, { state: { path } }) }
        >
            <RestaurantName>
                { restaurant.restaurantName }
            </RestaurantName>
            {
                restaurant.restaurantCuisine 
                ? <Cuisine>{ restaurant.restaurantCuisine }</Cuisine> 
                : null
            }
            <p>
                <span>
                    {
                        restaurant.restaurantVisitStatus  
                        ? <EatenIcon src={ EatStatusColor } alt="been to icon"/> 
                        : <NewPlaceIcon src={ EatStatusNew } alt="have not been to icon" />
                    }
                </span>
                {
                    restaurant.restaurantVisitStatus 
                    ? <span>
                        {
                            restaurant.restaurantCategory === "liked" 
                            ? <LikeIcon>
                                <AiOutlineLike/>
                            </LikeIcon>
                            : <DislikeIcon>
                                <AiOutlineDislike/>
                            </DislikeIcon> 
                        }
                    </span> 
                    : null
                }
                {
                    restaurant.restaurantFavorite === true
                    ? <FavoriteIcon>
                        <AiFillStar/>
                    </FavoriteIcon> 
                    : null 
                }
            </p>
        </RestaurantLinkBtn>
    );

};

export default InfoPopUp;

const RestaurantLinkBtn = styled.button`
    font-size: 1.2rem;
    font-family: var(--body-font);
    text-align: center;
    margin: 10px 0;
    padding: 10px 20px;
    border: 1px solid #f0f0f0;
    border-radius: 15px;
    box-shadow: 0 2px 5px #e8e8e8;
    background-color: white;

    &:hover {
        cursor: pointer;
    }
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

const RestaurantName = styled.span`
    font-size: 1.3rem;
`;

const Cuisine = styled.span`
    display: block;
`;