import styled from "styled-components";
import { useState } from "react";

import SearchResults from "../SearchResults";

const FindARestaurantPage = () => {
    const [restaurantName, setRestaurantName] = useState("");
    const [city, setCity] = useState("");
    const [street, setStreet] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [searchState, setSearchState] = useState(false);
    const [errorStatus, setErrorStatus] = useState(false);
    const [errorMessage, setErrorMessage] = useState("Please enter an restaurant name and city.");

    const handleAddressInputChange = (e) => {
        if(errorStatus){
            setErrorStatus(false);
            setErrorMessage("Please enter an restaurant name and city.");
        }
        setStreet(e.target.value);
    };
    
    const handleRestaurantNameInputChange = (e) => {
        if(errorStatus){
            setErrorStatus(false);
            setErrorMessage("Please enter an restaurant name and city.");
        }
        setRestaurantName(e.target.value);
    };

    const handleCityInputChange = (e) => {
        if(errorStatus){
            setErrorStatus(false);
            setErrorMessage("Please enter an restaurant name and city.");
        }
        setCity(e.target.value);
    };

    const handleSearch = () => {
        if(restaurantName === " " || city === " ") {
            setErrorStatus(true);
        }
        else {
            setSearchState(true);
            const restaurantNameParam = `${restaurantName.trim().toLowerCase()}`;
            const cityParam = `${city.trim().toLowerCase()}`;
            const streetParam = `${street.trim().toLowerCase()}`;

            const uri = encodeURI(`/get-find-restaurant/${restaurantNameParam}/${cityParam}?street=${streetParam}`);
            fetch(uri)
            .then(res => res.json())
            .then(results => {
                if(results.status === 200) {
                    setRestaurantName("");
                    setCity("");
                    setStreet("");
                    setSearchResults(results.data);
                }
                else {
                    setSearchState(false);
                    return Promise.reject(results);
                }
            })
            .catch(err => {
                setErrorStatus(true);
                setErrorMessage(err.message);
                console.log(err)
            })
        }
    };

    const handleMakeNewSearch = () => {
        setSearchResults(null);
        setRestaurantName("");
        setCity("");
        setStreet("");
        setSearchState(false);
    };

    return (
        <Wrapper>
            <p>Find a Restaurant</p>
            {!searchState && !searchState ?    
                (<>
                    <InputSection>
                        <label>
                            Restaurant Name:
                            <RestaurantInput
                                value={restaurantName}
                                placeholder="Onoir"
                                onChange={handleRestaurantNameInputChange}
                            />
                        </label>
                        <label>
                            City:
                            <CityInput 
                                value={city}
                                placeholder="Montreal"
                                onChange={handleCityInputChange}
                            />
                        </label>
                        <label>
                            Street:
                            <StreetInput
                                value={street}
                                placeholder="saint-catherine"
                                onChange={handleAddressInputChange}
                            />
                        </label>
                    </InputSection>
                    <button 
                        disabled={!restaurantName || !city}
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </>)
            : searchResults && searchState
            ? (
                <div>
                    <button onClick={handleMakeNewSearch}>Make another search</button>
                    <div>
                        {
                            searchResults.map((restaurant) => {
                                return <SearchResults key={`search${restaurant.id}`} restaurant={restaurant} />
                            })
                        }
                    </div>
                </div>
            )
            : <p>Loading...</p>}
            {errorStatus ? <p>{errorMessage}</p> : null}
        </Wrapper>
    )
};

export default FindARestaurantPage;

const Wrapper = styled.div`
    font-size: var(--body-font);
    display: flex;
    flex-direction: column;
    width: calc(100vw - 250px);
    justify-content: center;
    align-items: center;
`;

const InputSection = styled.div`
    display: flex;
    flex-direction: column;
    margin: 20px 0;
`;

const RestaurantInput = styled.input`
    border: none;
    border-bottom: 1px solid black;
    padding: 5px;
`;

const CityInput = styled(RestaurantInput)`
    width: 269px;
`;

const StreetInput = styled(RestaurantInput)`
    width: 257px;
`;