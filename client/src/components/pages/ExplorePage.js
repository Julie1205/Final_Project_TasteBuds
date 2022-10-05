import styled from "styled-components";
import { useState } from "react";

import SearchResults from "../SearchResults";

const ExplorePage = () => {
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [searchState, setSearchState] = useState(false);
    const [errorStatus, setErrorStatus] = useState(false);
    const [errorMessage, setErrorMessage] = useState("Please enter an address and city.");

    const handleAddressInputChange = (e) => {
        if(errorStatus){
            setErrorStatus(false);
            setErrorMessage("Please enter an address and city.");
        }
        setAddress(e.target.value);
    };

    const handleCityInputChange = (e) => {
        if(errorStatus){
            setErrorStatus(false);
            setErrorMessage("Please enter an address and city.");
        }
        setCity(e.target.value);
    };

    const handleSearch = () => {
        if(address === " " || city === " ") {
            setErrorStatus(true);
        }
        else {
            setSearchState(true);
            const addressParam = `${address.trim().toLowerCase()} ${city.trim().toLowerCase()}`;
            const uri = encodeURI(`/get-restaurants-near-me/${addressParam}`);

            fetch(uri)
            .then(res => res.json())
            .then(results => {
                if(results.status === 200) {
                    setAddress("");
                    setCity("");
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
        setAddress("");
        setCity("");
        setSearchState(false);
    };

    return (
        <Wrapper>
            {!searchState && !searchState ?    
                (<>
                    <p>Explore Your area. Find restaurants near you.</p>
                    <InputSection>
                        <label>
                            Street Address:
                            <AddressInput
                                value={address}
                                placeholder="123 Guy"
                                onChange={handleAddressInputChange}
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
                    </InputSection>
                    <button 
                        disabled={!address || !city}
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </>)
            : searchResults && searchState
            ? (
                <div>
                    <p>Restaurants Near You</p>
                    <div>
                        {searchResults.length > 0 ?
                        <>
                            <button onClick={handleMakeNewSearch}>Make another search</button>
                            {searchResults.map((restaurant) => {
                                return <SearchResults key={`search${restaurant.id}`} restaurant={restaurant} />
                            })}
                        </>
                        : <div>
                            <p>No Restaurants Found</p>
                            <button onClick={handleMakeNewSearch}>Make another search</button>
                        </div>}
                    </div>
                </div>
            )
            : <p>Loading...</p>}
            {errorStatus ? <p>{errorMessage}</p> : null}
        </Wrapper>
    );
};

export default ExplorePage;

const Wrapper = styled.div`
    font-size: var(--body-font);
    display: flex;
    flex-direction: column;
    /* width: calc(100vw - 250px); */
    justify-content: center;
    align-items: center;
`;

const InputSection = styled.div`
    display: flex;
    flex-direction: column;
    margin: 20px 0;
`;

const AddressInput = styled.input`
    border: none;
    border-bottom: 1px solid black;
    padding: 5px;
`;

const CityInput = styled(AddressInput)`
    width: 250px;
`;
