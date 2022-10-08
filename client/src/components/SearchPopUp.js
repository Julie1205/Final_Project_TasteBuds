import styled from "styled-components";
import { Link } from "react-router-dom";
import { BsFillBookmarkFill } from "react-icons/bs";
import { FiMapPin } from "react-icons/fi";
import { HiOutlinePhone } from "react-icons/hi";
import { IoEarthSharp } from "react-icons/io5";

const SearchPopUp = ( { restaurant } ) => {

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
                    <AddressResult>
                        { restaurant.address }
                    </AddressResult>
                </AddressSection>
                { restaurant.phone_number 
                ? <PhoneSection>
                    <PhoneIcon>
                        <HiOutlinePhone/>
                    </PhoneIcon>
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
            </RestaurantInfoSection>
            <SaveIcon 
                to="/home/addRestaurant" 
                state={ { data: restaurant } }
            >
                <Icon>
                    <BsFillBookmarkFill />
                </Icon>
            </SaveIcon>
        </RestaurantInfo>
    )
};

export default SearchPopUp;

const RestaurantInfo = styled.div`
    margin: 15px 0;
    max-width: 100%;
    border: 1px solid black;
    display: grid;
    grid-template-columns: calc(100% - 50px) 50px;
    align-items: baseline;
    padding: 10px 15px;
    border: 1px solid #f0f0f0;
    border-radius: 15px;
    box-shadow: 0 2px 5px #e8e8e8;
`;

const Icon = styled.span`
    color: #0c5a4a;

    &:hover {
        color: #009933;
    };
`;

const SaveIcon = styled(Link)`
    text-decoration: none;
    font-size: 1.2rem;
    padding: 5px 10px;
    border-radius: 10px;
    color: #0c5a4a;

    &:hover {
        cursor: pointer;
        background-color: transparent;
    };

    &:active {
        transform: scale(0.85);
    }
`;

const NameSection = styled.p`
    margin: 2px 0;
    display: flex;
    align-items: center;
`;

const AddressSection = styled(NameSection)`
`;

const PhoneSection = styled(NameSection)`
`;

const WebsiteSection = styled(NameSection)`
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
    font-family: var(--body-font);
    font-size: 1rem;
    width: 200px;
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