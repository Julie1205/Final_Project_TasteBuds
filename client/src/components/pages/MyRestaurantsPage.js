const MyRestaurantsPage = () => {
    return (
        <div>
            <p>My Restaurants</p>
            <p>filter by:</p>
            <label>
                <input type="radio" name="category" value="all"/>
                All
            </label>
            <label>
                <input type="radio" name="category" value="like"/>
                Liked
            </label>
            <label>
                <input type="radio" name="category" value="dislike"/>
                Disliked
            </label>
            <label>
                <input type="radio" name="category" value="favorite"/>
                Favorite
            </label>
            <label>
                <input type="radio" name="category" value="been_to" />
                Liked/Disliked
            </label>
            <label>
                <input type="radio"name="category" value="wished"/>
                Wish List
            </label>
        </div>
    );
};

export default MyRestaurantsPage;