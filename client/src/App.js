import { BrowserRouter, Routes, Route } from "react-router-dom";

import GlobalStyles from "./components/GlobalStyles";
import LandingPage from "./components/pages/Landing_Page_Components/LandingPage";
import HomePage from "./components/pages/Home_Page_Components/HomePage";
import MyRestaurantsPage from "./components/pages/MyRestaurantsPage";
import ExplorePage from "./components/pages/Search_Pages_Components/ExplorePage";
import RestaurantsByCategoryPage from "./components/pages/Restaurants_Category_Page_Components/RestaurantsByCategoryPage";
import AddRestaurantPage from "./components/pages/AddRestaurantPage";
import FindARestaurantPage from "./components/pages/Search_Pages_Components/FindARestaurantPage";
import RestaurantDetailsPage from "./components/pages/RestaurantDetailsPage"
import EditRestaurantPage from "./components/pages/EditRestaurantPage";
import PageNotFound from "./components/pages/PageNotFound";

const App = () => {

  return (
    <BrowserRouter>
    <GlobalStyles/>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/home" element={<HomePage />}>
          <Route path="explore" element={<ExplorePage />} />
          <Route path="myRestaurants" element={<MyRestaurantsPage />} >
            <Route path=":category" element={<RestaurantsByCategoryPage />} />
          </Route>
          <Route path="restaurant/:id" element={<RestaurantDetailsPage/>} />
          <Route path="restaurant/edit/:id" element={<EditRestaurantPage/>} />
          <Route path="addRestaurant" element={<AddRestaurantPage />}/>
          <Route path="findARestaurant" element={<FindARestaurantPage />}/>
          <Route path="*" element={<PageNotFound />} />
        </Route> 
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
