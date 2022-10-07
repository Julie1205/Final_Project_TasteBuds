import { useLocation, Link } from "react-router-dom"; 
import { useState } from "react";
import styled from "styled-components";
import Dialog from '@mui/material/Dialog';
import { BiSearch } from "react-icons/bi";


const SearchBar = ( { restaurants } ) => {
    const [openModal, setOpenModal] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const path = useLocation().pathname;

    let searchMatches = [];

    if(searchValue.length >= 2) {
    searchMatches = restaurants.filter((restaurant) => {
            return restaurant.restaurantName.toLowerCase().includes(searchValue.toLowerCase().trim());
        })
    }

    const handleOpen = () => {
        setOpenModal(true);
    };

    const handleClose = () => {
        setSearchValue("")
        setOpenModal(false);
    };

    return (
        <>
            <SearchBtn 
                onClick={handleOpen}
            >
                Search in category
            </SearchBtn>
            <Dialog 
                open={openModal} 
                onClose={handleClose}
            >
                <SearchModal>
                    <SearchBarArea>
                        <label>
                            <SearchInput
                                value={searchValue}
                                placeholder="search restaurant"
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                            <SearchLabel>
                                <BiSearch/>
                            </SearchLabel>
                        </label>
                    </SearchBarArea>
                    {searchMatches.length > 0 
                    ? <SearchResultArea>
                        {searchMatches.map((match) => {
                            return (
                                <ResultLink
                                    key={`search${match._id}`}
                                    to={`/home/restaurant/${match._id}`} 
                                    state={ { path } }
                                >
                                    {match.restaurantName}
                                </ResultLink>
                            )
                        })}
                    </SearchResultArea>
                    : null}
                </SearchModal>
            </Dialog>
        </>
    )
};

export default SearchBar;

const SearchBtn = styled.button`
    font-family: var(--body-font);
    font-size: 1rem;
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

const SearchModal = styled.div`
    max-width: fit-content;
    max-height: fit-content;
    min-width: 200px;
    min-height: 60px;
`;

const SearchInput = styled.input`
    font-family: var(--body-font);
    font-size: 1.2rem;
    padding: 5px;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
`;

const SearchLabel = styled.span`
    font-size: 1.2rem;
    position: relative;
    top: 5px;
`;

const SearchBarArea = styled.div`
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    margin-top: 10px;
    width: 300px;
`;

const SearchResultArea = styled.div`
    margin: 15px;
    text-align: center;
    font-family: var(--body-font);
    font-size: 1.1rem;
`;

const ResultLink = styled(Link)`
    text-decoration: none;
    margin-bottom: 5px;
    color: black;
    padding: 5px 0;
    border-radius: 5px;
    display: block;
    box-shadow: 0 2px 5px #e8e8e8;

    &:hover {
        background-color: #e8e8e8;
    };
`;