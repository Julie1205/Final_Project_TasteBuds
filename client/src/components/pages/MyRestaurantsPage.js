import { Outlet, NavLink } from "react-router-dom";
import styled from "styled-components";
import { AiFillStar, AiOutlineLike, AiOutlineDislike} from "react-icons/ai";
import EatStatusColor from "../../assets/EatStatusColor.png"
import EatStatusNew from "../../assets/EatStatus_new2.png"
import { CATEGORIES } from "../constants/categories";

const MyRestaurantsPage = () => {
    const LOGOS = [
        <AllTab>All</AllTab>, 
        <EatenIcon src={ EatStatusColor } alt="been to icon"/>,
        <LikeIcon><AiOutlineLike/></LikeIcon>,
        <DislikeIcon><AiOutlineDislike/></DislikeIcon> ,
        <FavoriteIcon><AiFillStar/></FavoriteIcon> ,
        <NewPlaceIcon src={ EatStatusNew } alt="have not been to icon" />
    ];

    return (
        <Wrapper>
            <PageTitle>My Restaurants</PageTitle>
            <LinkSection>
                {
                    CATEGORIES.map((category, index) => {
                        return (
                            <CateroryLink 
                                key={category} 
                                to={category}
                            >
                                <CategoryName>
                                    { category.replace("_", " ") }
                                </CategoryName>
                                { LOGOS[index] }
                            </CateroryLink>
                        );
                    })
                }
            </LinkSection>
            <Outlet/>
        </Wrapper>
    );
};

export default MyRestaurantsPage;

const Wrapper = styled.div`
    font-size: 1.3rem;
    margin: var(--offset-top) 20px;
    font-family: var(--body-font);
`;

const LinkSection = styled.div`
    margin: 15px 0;
    padding: 5px 10px 5px 0;
    border-bottom: 1px solid #cccccc;
`;

const CateroryLink = styled(NavLink)`
    text-decoration: none;
    color: black;
    font-size: var(--body-font);
    padding: 5px 14px ;

        &.active {
            color: white;
            border-radius: 10px 10px 0 0;
            background-color: #cccccc;
            border-top: 1px solid #bfbfbf;
            border-left: 1px solid #bfbfbf;
            border-right: 1px solid #bfbfbf;
        };
`;

const PageTitle = styled.p`
    font-size: 2rem;
`;

const FavoriteIcon = styled.span`
    position: relative;
    top: 2px;
    font-size: 1.5rem;
    margin-left: 5px;
    color: #e6b800;
`;

const EatenIcon = styled.img`
    width: 35px;
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
    font-size: 1.5rem;
`;

const DislikeIcon = styled(LikeIcon)`
`;

const CategoryName = styled.span`
    @media (max-width: 1035px) {
        font-size: 1.1rem;
    };
    
    @media (max-width: 975px) {
        display: none;
    };
`;

const AllTab = styled.span`
    display: none;

    @media (max-width: 975px) {
        display: inline;
    };
`;