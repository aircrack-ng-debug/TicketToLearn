import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { ticket2learn } from "../assets";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
    const [openNavigation, setOpenNavigation] = useState(false);
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');

    const toggleNavigation = () => {
        if (openNavigation) {
            setOpenNavigation(false);
            enablePageScroll();
        } else {
            setOpenNavigation(true);
            disablePageScroll();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div
            className={`fixed top-0 left-0 w-full z-50  border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
                openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
            }`}
        >
            <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
                <Link
                    to="/"
                    className="block w-[12rem] xl:mr-8" href="#hero">
                    <img src={ticket2learn} width={190} height={40} alt="Ticket2Learn" />
                </Link>

                <nav
                    className={`${
                        openNavigation ? "flex" : "hidden"
                    } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
                >
                    <h5>Project Members: Maurice, Marius, Alexander, Paul</h5>
                </nav>

                {isAuthenticated ? (
                    <>
                        <Link
                            to="/my-page"
                            className="button hidden mr-8 text-n-1/50 transition-colors hover:text-n-1 lg:block"
                        >
                            My Page
                        </Link>
                        <Button className="hidden lg:flex" onClick={handleLogout}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/signup"
                            className="button hidden mr-8 text-n-1/50 transition-colors hover:text-n-1 lg:block"
                        >
                            New account
                        </Link>
                        <Button className="hidden lg:flex" href="/login">
                            Sign in
                        </Button>
                    </>
                )}

                <Button
                    className="ml-auto lg:hidden"
                    px="px-3"
                    onClick={toggleNavigation}
                >
                    <MenuSvg openNavigation={openNavigation} />
                </Button>
            </div>
        </div>
    );
};

export default Header;
