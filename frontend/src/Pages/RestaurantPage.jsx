import AvailableMenu from "@/components/AvailableMenu";
import { Badge } from "@/components/ui/badge";
import { useRestaurantStore } from "@/Stores/useRestaurantStore";
import { MapPin, Timer } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const RestaurantPage = () => {
    const { restaurantId } = useParams();

    const { getSingleRestaurant, singleRestaurant } = useRestaurantStore();

    useEffect(() => {
        getSingleRestaurant(restaurantId);
    }, [restaurantId, getSingleRestaurant]);


    return (
        <div className="max-w-6xl mx-auto my-10">
            <div className="w-full">
                <div className="relative w-full h-32 md:h-64 lg:h-72">
                    <img
                        src={singleRestaurant?.imageURL || "Loading..."}
                        alt="res_image"
                        className="object-cover w-full h-full rounded-lg shadow-lg"
                    />
                </div>
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="my-5">
                        <h1 className=" text-start font-medium text-xl">{singleRestaurant?.restaurantName}</h1>
                        <div className="flex gap-2 my-2">
                            {singleRestaurant?.cuisines.map((cuisine, idx) => (
                                <Badge key={idx}>{cuisine}</Badge>
                            ))}
                        </div>
                        <div className="flex md:flex-row flex-col gap-2 my-5">
                    
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                <h1 className="flex items-center gap-2 font-medium">
                                    City: <span className="text-[#D19254]">{singleRestaurant?.city}</span>
                                </h1>
                            </div>
                            <div className="flex items-center gap-2">
                                <Timer className="w-5 h-5" />
                                <h1 className="flex items-center gap-2 font-medium">
                                    Delivery Time: <span className="text-[#D19254]">{singleRestaurant?.deliveryTime || "NA"} mins</span>
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                {singleRestaurant?.menus && <AvailableMenu menus={singleRestaurant?.menus} />}
            </div>
        </div>
    );
};

export default RestaurantPage;