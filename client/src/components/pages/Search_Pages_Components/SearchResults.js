import styled from "styled-components";
import { Link } from "react-router-dom";
import { BsFillBookmarkFill } from "react-icons/bs";
import { FiMapPin } from "react-icons/fi";
import { HiOutlinePhone } from "react-icons/hi";
import { IoEarthSharp } from "react-icons/io5";

const SearchResults = ( { restaurant } ) => {

    return (
        <RestaurantInfo>
            <RestaurantInfoSection>
                <NameSection>
                    <NameResult>
                        { restaurant.name }
                    </NameResult>
                </NameSection>
                <AddressSection>
                    <PlaceIcon>
                        <FiMapPin />
                    </PlaceIcon>
                    <AddressLabel>
                        Address:
                    </AddressLabel>
                    <AddressResult>
                        { restaurant.address }
                    </AddressResult>
                </AddressSection>
                { restaurant.phone_number 
                ? <PhoneSection>
                    <PhoneIcon>
                        <HiOutlinePhone/>
                    </PhoneIcon>
                    <PhoneLabel>
                        Phone Number:
                    </PhoneLabel>
                    <PhoneResult>
                        { restaurant.phone_number }
                    </PhoneResult>
                </PhoneSection> 
                : null
                }
                { restaurant.website 
                ? <WebsiteSection>
                    <WebIcon>
                        <IoEarthSharp/>
                    </WebIcon>
                    <WebsiteLabel>
                        Website:
                    </WebsiteLabel> 
                    <WebsiteResult 
                        href={ `${ restaurant.website }` } 
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        { restaurant.website }
                    </WebsiteResult>
                </WebsiteSection> 
                : null
                }
                { restaurant.distance 
                ? <DistanceSection>
                    <DistanceLabel>
                        Distance:
                    </DistanceLabel>
                    <DistanceResult>
                        { `${ restaurant.distance }m` }
                    </DistanceResult>
                </DistanceSection>
                : null
                }
            </RestaurantInfoSection>
            <SaveIcon 
                to="/home/addRestaurant" 
                state={ { data: restaurant } }
            >
                <SaveText>Save</SaveText>
                <BsFillBookmarkFill />
            </SaveIcon>
        </RestaurantInfo>
    )
};

export default SearchResults;

const RestaurantInfo = styled.div`
    margin: 15px 0;
    max-width: 60vw;
    border: 1px solid black;
    display: grid;
    grid-template-columns: calc(100% - 80px) 80px;
    align-items: flex-start;
    padding: 10px 15px;
    border: 1px solid #f0f0f0;
    border-radius: 15px;
    box-shadow: 0 2px 5px #e8e8e8;
    background-color: white;

    @media (max-width: 850px) {
        grid-template-columns: calc(100% - 42px) 42px;
    };
`;

const SaveIcon = styled(Link)`
    text-decoration: none;
    font-family: var(--body-font);
    font-size: 0.90rem;
    padding: 5px 10px;
    border: 1px solid #0c5a4a;
    border-radius: 10px;
    background-color: #0c5a2a;
    color: white;
    display: flex;
    align-items: center;
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
`;

const SaveText = styled.p`
    margin-right: 5px;

    @media (max-width: 850px) {
        display: none;
    };
`;

const AddressLabel = styled.span`
    font-weight: bold;
    margin-right: 5px;

    @media (max-width: 850px) {
        display: none;
    };
`;

const PhoneLabel = styled(AddressLabel)`
    @media (max-width: 850px) {
        display: none;
    };
`;

const WebsiteLabel = styled(AddressLabel)`
    @media (max-width: 850px) {
        display: none;
    };
`;

const DistanceLabel = styled(AddressLabel)`
    @media (max-width: 850px) {
        display: inline;
    };
`;

const NameSection = styled.p`
    margin: 5px 0 10px 0;

    @media (max-width: 850px) {
        display: flex;
        align-items: center;
    };
`;

const AddressSection = styled(NameSection)`
    margin: 5px 0;
`;

const PhoneSection = styled(NameSection)`
    margin: 5px 0;
`;

const WebsiteSection = styled(NameSection)`
    margin: 5px 0;
`;

const DistanceSection = styled(NameSection)`
    margin: 5px 0;
`;

const NameResult = styled.span`
    word-wrap: break-word;
    font-weight: bold;
    font-size: 1.2rem;
`;

const AddressResult = styled.span`
    word-wrap: break-word;
    font-weight: normal;
    font-size: 1rem;
`;

const PhoneResult = styled(AddressResult)`
`;

const WebsiteResult = styled.a`
    word-wrap: break-word;
    
    @media (max-width: 850px) {
        width: 95%;
    }
`;

const DistanceResult = styled(AddressResult)`
`;

const RestaurantInfoSection = styled.div`
    max-width: 55vw;
`;

const PlaceIcon = styled.span`
    margin-right: 5px;
`;

const PhoneIcon = styled(PlaceIcon)`
`;

const WebIcon = styled(PlaceIcon)`
`;