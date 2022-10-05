import styled from "styled-components";
import { Link } from "react-router-dom";
import { BsFillBookmarkFill } from "react-icons/bs";

const restaurant = ( { restaurant } ) => {
    return (
        <RestaurantInfo>
            <RestaurantInfoSection>
                <NameSection>
                    <NameLabel>
                        Name:
                    </NameLabel>
                    <NameResult>
                        {restaurant.name}
                    </NameResult>
                </NameSection>
                <AddressSection>
                    <AddressLabel>
                        Address:
                    </AddressLabel>
                    <AddressResult>
                        {restaurant.address}
                    </AddressResult>
                </AddressSection>
                {restaurant.phone_number 
                ? <PhoneSection>
                    <PhoneLabel>
                        Phone Number:
                    </PhoneLabel>
                    <PhoneResult>
                        {restaurant.phone_number}
                    </PhoneResult>
                </PhoneSection> 
                : null
                }
                {restaurant.website 
                ? <WebsiteSection>
                    <WebsiteLabel>
                        Website:
                    </WebsiteLabel> 
                    <WebsiteResult 
                        href={`${restaurant.website}`} 
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        {restaurant.website}
                    </WebsiteResult>
                </WebsiteSection> 
                : null
                }
                <DistanceSection>
                    <DistanceLabel>
                        Distance:
                    </DistanceLabel>
                    <DistanceResult>
                        {`${restaurant.distance}m`}
                    </DistanceResult>
                </DistanceSection>
            </RestaurantInfoSection>
            <SaveIcon 
                to="/home/addRestaurant" 
                state={{data: restaurant}}
            >
                <SaveText>Save</SaveText>
                <BsFillBookmarkFill />
            </SaveIcon>
        </RestaurantInfo>
    )
};

export default restaurant;

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

    @media (max-width: 850px){
        grid-template-columns: calc(100% - 42px) 42px;
    }
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

    @media (max-width: 850px){
        display: none;
    }
`;

const NameLabel = styled.span`
    font-weight: bold;
    margin-right: 5px;
`;

const AddressLabel = styled(NameLabel)`
`;

const PhoneLabel = styled(NameLabel)`
`;

const WebsiteLabel = styled(NameLabel)`
`;

const DistanceLabel = styled(NameLabel)`
`;

const NameSection = styled.p`
    margin: 5px 0;
`;

const AddressSection = styled(NameSection)`
`;

const PhoneSection = styled(NameSection)`
`;

const WebsiteSection = styled(NameSection)`
`;

const DistanceSection = styled(NameSection)`
`;

const NameResult = styled.span`
    word-wrap: break-word; 
`;

const AddressResult = styled(NameResult)`
`;

const PhoneResult = styled(NameResult)`
`;

const WebsiteResult = styled.a`
    word-wrap: break-word; 
`;

const DistanceResult = styled(NameResult)`
`;

const RestaurantInfoSection = styled.div`
    max-width: 55vw;
`;