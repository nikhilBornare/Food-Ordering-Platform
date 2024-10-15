import { Link, NavLink } from "react-router-dom";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger, } from "./ui/menubar";
import { Button } from "./ui/button";
import { Loader2, Moon, PackageCheck, PlusCircle, ShoppingCart, SquareMenu, Sun, UtensilsCrossed, } from "lucide-react";
import { useEffect } from "react";
import { useUserStore } from "@/Stores/useUserStore";
import MobileNavbar from "./MobileNavbar";
import { useCartStore } from "@/Stores/useCartStore";
import { useThemeStore } from "@/Stores/useThemeStore";


const Navbar = () => {
    const { setTheme, theme } = useThemeStore()
    const { logout, loading, user } = useUserStore();
    const { cart, getCart } = useCartStore();

    const logoutHandle = async () => {
        await logout();
    };
    useEffect(() => {
        getCart()
    }, [getCart]);

    return (
        <nav className=" max-w-7xl mx-auto">
            <div className="flex items-center justify-between h-14">
                <Link to="/">
                    <h1 className="font-bold md:font-extrabold text-2xl">FoodEats</h1>
                </Link>
                <div className="hidden md:flex items-center gap-10">
                    <div className="hidden md:flex items-center gap-6">
                        <NavLink to="/" className={({ isActive }) => isActive ? "bg-orange text-gray-900 rounded-lg p-1" : "hover:bg-hoverOrange hover:text-gray-900 rounded-lg p-1"}>Home</NavLink>
                        <NavLink to="/orders" className={({ isActive }) => isActive ? "bg-orange text-gray-900 rounded-lg p-1" : "hover:bg-hoverOrange hover:text-gray-900 rounded-lg p-1"}>Orders</NavLink>
                        <NavLink to={'/profile'} className={({ isActive }) => isActive ? "hidden md:flex items-center bg-orange text-gray-900 rounded-lg p-1" : "hidden md:flex items-center hover:bg-hoverOrange hover:text-gray-900 rounded-lg p-1"}> Profile</NavLink>

                        {user.role === 'customer' &&
                            <Link to="/add-my-restaurant" className="flex items-center gap-1 hover:bg-hoverOrange hover:text-gray-900 p-1 rounded-lg cursor-pointer  font-medium"                        >
                                <PlusCircle />
                                <span>Restaurant</span>
                            </Link>
                        }
                        {user.role === 'admin' && (
                            <div className="cursor-pointer">
                                <Menubar >
                                    <MenubarMenu>
                                        <MenubarTrigger className="cursor-pointer">Dashboard</MenubarTrigger>
                                        <MenubarContent >
                                            <Link to="/admin/restaurant" >
                                                <MenubarItem><UtensilsCrossed size={15} className="mr-2 " />
                                                    <span>My Restaurant</span></MenubarItem>
                                            </Link>
                                            <Link to="/admin/menu">
                                                <MenubarItem><SquareMenu size={15} className="mr-2" />
                                                    <span>My Restaurant Menu</span></MenubarItem>
                                            </Link>
                                            <Link to="/admin/orders">
                                                <MenubarItem><PackageCheck size={15} className="mr-2" />
                                                    <span>My Restaurant Orders</span></MenubarItem>
                                            </Link>
                                        </MenubarContent>
                                    </MenubarMenu>
                                </Menubar>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <NavLink to="/cart" className={({ isActive }) => isActive ? "relative cursor-pointer bg-orange text-gray-900 rounded-lg p-1" : "relative cursor-pointer hover:bg-hoverOrange hover:text-gray-900 rounded-lg p-1"}>
                            <ShoppingCart />
                            {cart.length > 0 && (
                                <Button
                                    size={"icon"}
                                    className="absolute -inset-y-1 left-3 text-xs rounded-full w-4 h-4 bg-red-500 hover:bg-red-500"
                                >
                                    {cart.length}
                                </Button>
                            )}
                        </NavLink>
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

                        <div>
                            {loading ? (
                                <Button className="bg-orange hover:bg-hoverOrange">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>
                            ) : (
                                <Button
                                    onClick={logoutHandle}
                                    className="bg-orange hover:bg-hoverOrange"
                                >
                                    Logout
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="md:hidden lg:hidden">
                    {/* Mobile responsive  */}
                    <MobileNavbar
                        user={user}
                        cart={cart}
                        theme={theme}
                        setTheme={setTheme}
                        logoutHandle={logoutHandle}
                        loading={loading}
                    />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

