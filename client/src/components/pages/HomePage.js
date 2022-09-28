import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import NavigationBar from "../NavigationBar";

const HomePage = () => {
    const location = useLocation().pathname;
    const navigate = useNavigate();

    useEffect(() => {
        if(location === "/home") {
            navigate("explore");
        }
    }, [location]);

    return (
        <div>
            <div>
                <p>Logo</p>
                <p>Welcome User!</p>
                <button>Logout</button>
            </div>
            <NavigationBar/>
            <Outlet />
        </div>
    )
};

export default HomePage;