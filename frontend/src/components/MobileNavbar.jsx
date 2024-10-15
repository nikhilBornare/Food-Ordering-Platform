import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { HandPlatter, Loader2, Menu, Moon, PackageCheck, PlusCircle, ShoppingCart, SquareMenu, Sun, User, UtensilsCrossed } from "lucide-react";
import { Separator } from "./ui/separator";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import PropTypes from "prop-types";

const MobileNavbar = ({ user, cart, theme, setTheme, logoutHandle, loading }) => {
    MobileNavbar.propTypes = {
        user: PropTypes.object,
        cart: PropTypes.array,
        theme: PropTypes.string,
        setTheme: PropTypes.func,
        logoutHandle: PropTypes.func,
        loading: PropTypes.bool,
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    size={"icon"}
                    className="rounded-full bg-gray-200 text-black hover:bg-gray-200"
                    variant="outline"
                >
                    <Menu size={"18"} />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader className="flex flex-row items-center justify-between mt-2">
                    <SheetTitle>FoodEats</SheetTitle>
                    <div>
                        {theme === 'light' ? (
                            <Button onClick={() => setTheme('dark')} variant="outline" size="icon">
                                <Sun className="h-6 w-6" />
                            </Button>
                        ) :
                            <Button onClick={() => setTheme('light')} variant="outline" size="icon">
                                <Moon className="h-6 w-6" />
                            </Button>
                        }

                    </div>
                </SheetHeader>
                <Separator />
                <SheetDescription className="flex-1">
                    <Link to="/profile"
                        className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                    >
                        <User />
                        <span>Profile</span>
                    </Link>
                    <Link to="/orders"
                        className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                    >
                        <HandPlatter />
                        <span>Orders</span>
                    </Link>
                    <Link to="/cart"
                        className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                    >
                        <ShoppingCart />
                        <span>Cart ({cart.length})</span>
                    </Link>
                    {user.role ==='customer' && <Link to="/add-my-restaurant"
                        className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                    >
                        <PlusCircle />
                        <span>Add My Restaurant</span>
                    </Link>}
                    {user.role === 'admin' && (
                        <>
                            <Link to="/admin/restaurant"
                                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                            >
                                <UtensilsCrossed />
                                <span>My Restaurant</span>
                            </Link>
                            <Link to="/admin/menu"
                                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                            >
                                <SquareMenu />
                                <span>My Restaurant Menu</span>
                            </Link>
                            <Link to="/admin/orders"
                                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                            >
                                <PackageCheck />
                                <span>My Restaurant Orders</span>
                            </Link>
                        </>
                    )}
                </SheetDescription>
                <SheetFooter className="flex flex-col sm:flex-col gap-4">
                    <div className="flex flex-row items-center gap-2">
                        <Avatar>
                            <AvatarImage src={user?.profilePicture} />
                            <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h1 className="font-bold">{user.fullName}</h1>
                    </div>
                    <SheetClose asChild>
                        {loading ? (
                            <Button className="bg-orange hover:bg-hoverOrange">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please Wait..
                            </Button>
                        ) : (
                            <Button
                                onClick={logoutHandle}
                                className="bg-orange hover:bg-hoverOrange"
                            >
                                Logout
                            </Button>
                        )}
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default MobileNavbar;