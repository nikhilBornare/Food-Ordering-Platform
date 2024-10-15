import Loading from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRestaurantStore } from "@/Stores/useRestaurantStore";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

const Restaurant = () => {
    const { loading, restaurant, updateRestaurant, createRestaurant, getRestaurant } = useRestaurantStore();

    const [input, setInput] = useState({
        restaurantName: restaurant?.restaurantName || "",
        city: restaurant?.city || "",
        country: restaurant?.country || "",
        deliveryTime: restaurant?.deliveryTime || 0,
        imageFile: undefined,
    });

    const changeEventHandler = (e) => {
        const { name, value, } = e.target;
        setInput({ ...input, [name]: value });
    };
    const handleImageChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setInput({ ...input, imageFile: reader.result });
            };
        }
    };
    const [cuisines, setCuisines] = useState(restaurant?.cuisines || []);
    const [inputCuisine, setInputCuisine] = useState("");
    const addCuisine = () => {
        const trimmedInput = inputCuisine.trim(); // Trim spaces
        if (trimmedInput.length > 0) {
            const capitalizedCuisine =
                trimmedInput.charAt(0).toUpperCase() + trimmedInput.slice(1).toLowerCase(); // Capitalize first letter

            if (!cuisines.includes(capitalizedCuisine)) {
                setCuisines([...cuisines, capitalizedCuisine]); // Add to the list if not already present
            }
        }
    };
    const handleCuisineSubmit = (e) => {
        e.preventDefault();
        addCuisine();
        setInputCuisine(""); // Clear the input field
    };
    const removeCuisine = (cuisineToRemove) => {
        setCuisines(cuisines.filter(cuisine => cuisine !== cuisineToRemove));
    };


    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            let restaurantData = {
                "restaurantName": input.restaurantName,
                "city": input.city,
                "country": input.country,
                "deliveryTime": input.deliveryTime.toString(),
                "cuisines": cuisines
            }
            if (input.imageFile) {
                restaurantData = { ...restaurantData, "restaurantImage": input.imageFile };
            }

            if (restaurant) {
                // update
                await updateRestaurant(restaurantData);

            } else {
                // create
                await createRestaurant(restaurantData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getRestaurant();
    }, [getRestaurant,]);

    useEffect(() => {
        if (restaurant) {
            setInput({
                restaurantName: restaurant.restaurantName || "",
                city: restaurant.city || "",
                country: restaurant.country || "",
                deliveryTime: restaurant.deliveryTime || 0,
                imageFile: undefined,
            });
            setCuisines(restaurant.cuisines || []);
        }
    }, [restaurant]);

    if (loading) {
        return <Loading />;
    }


    return (
        <div className="max-w-6xl mx-auto my-10">
            <div>

                <div>
                    <h1 className="font-extrabold text-2xl mb-5">Your Restaurant</h1>
                    <div className="relative w-full h-32 md:h-64 lg:h-72 mb-5">
                        <img
                            src={restaurant?.imageURL || "Loading..."}
                            alt="res_image"
                            className="object-cover w-full h-full rounded-lg shadow-lg"
                        />
                    </div>
                    <form onSubmit={submitHandler}>
                        <div className="md:grid grid-cols-2 gap-6 space-y-2 md:space-y-0">
                            {/* Restaurant Name  */}
                            <div className="items-start flex flex-col">
                                <Label className="ml-3 mb-1">Restaurant Name</Label>
                                <Input
                                    type="text"
                                    name="restaurantName"
                                    value={input.restaurantName}
                                    onChange={changeEventHandler}
                                    placeholder="Enter your restaurant name"
                                />

                            </div>
                            <div className="items-start flex flex-col">
                                <Label className="ml-3 mb-1">City</Label>
                                <Input
                                    type="text"
                                    name="city"
                                    value={input.city}
                                    onChange={changeEventHandler}
                                    placeholder="Enter your city name"
                                />

                            </div>
                            <div className="items-start flex flex-col">
                                <Label className="ml-3 mb-1">Country</Label>
                                <Input
                                    type="text"
                                    name="country"
                                    value={input.country}
                                    onChange={changeEventHandler}
                                    placeholder="Enter your country name"
                                />

                            </div>
                            <div className="items-start flex flex-col">
                                <Label className="ml-3 mb-1">Delivery Time</Label>
                                <Input
                                    type="number"
                                    name="deliveryTime"
                                    value={input.deliveryTime}
                                    onChange={changeEventHandler}
                                    placeholder="Enter your delivery time"
                                />

                            </div>

                            <div className="items-start flex flex-col">
                                <Label className="ml-3 mb-1">Cuisines</Label>
                                <div className="flex w-full">
                                    <Input
                                        type="text"
                                        value={inputCuisine}
                                        onChange={(e) => setInputCuisine(e.target.value)}
                                        placeholder="e.g. Momos, Biryani"
                                    />
                                    <Button className="relative bg-orange hover:bg-hoverOrange"
                                        onClick={handleCuisineSubmit}>Add</Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4 md:mb-0 mt-2">
                                    {cuisines.map(
                                        (addedCuisine, idx) => (
                                            <div
                                                key={idx}
                                                className="relative inline-flex items-center max-w-full"
                                            >
                                                <Badge
                                                    className="text-lg text-[#D19254] rounded-md hover:cursor-pointer pr-6 whitespace-nowrap"
                                                    variant="outline"
                                                >
                                                    {addedCuisine}
                                                </Badge>
                                                <X
                                                    onClick={() => removeCuisine(addedCuisine)}
                                                    size={16}
                                                    className="absolute text-[#D19254] right-1 hover:cursor-pointer"
                                                />
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="items-start flex flex-col">
                                <Label className="ml-3 mb-1">Upload Restaurant Banner</Label>
                                <Input
                                    onChange={handleImageChange}
                                    type="file"
                                    accept="image/*"
                                    name="imageFile"
                                />

                            </div>
                        </div>
                        <div className="my-5 w-fit">
                            {loading ? (
                                <Button disabled className="bg-orange hover:bg-hoverOrange">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>
                            ) : (
                                <Button className="bg-orange hover:bg-hoverOrange">
                                    {restaurant
                                        ? "Update Your Restaurant"
                                        : "Add Your Restaurant"}
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Restaurant;