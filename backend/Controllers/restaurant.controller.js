import Order from "../Models/order.model.js";
import User from "../Models/user.model.js";
import Restaurant from "../Models/restaurant.model.js";
import cloudinary from "../utils/cloudinary.js";

// admin controller
export const createResaurant = async (req, res) => {
    try {
        const { restaurantName, city, country, cuisines, deliveryTime, restaurantImage } = req.body;
        if (!restaurantName || !city || !country || !cuisines ||  !restaurantImage) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingRestaurant = await Restaurant.findOne({ user: req.userId });
        if (existingRestaurant) {
            return res.status(400).json({ message: "Restaurant already exist" });
        }

        const cloudResponse = await cloudinary.uploader.upload(restaurantImage, { folder: "Restaurant_Image", });

        const restaurant = new Restaurant({
            user: req.userId,
            restaurantName,
            city,
            country,
            cuisines,
            deliveryTime,
            imageURL: cloudResponse.secure_url || "",
        });

        await restaurant.save();
        const user = await User.findById(req.userId).select("role");
        user.role = "admin"
        await user.save();

        res.status(201).json({ message: "Restaurant created successfully", restaurant });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.userId })
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.status(200).json({ restaurant });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });

    }
}

export const updateRestaurant = async (req, res) => {
    try {
        const { restaurantName, city, country, cuisines, deliveryTime, restaurantImage } = req.body;
        const restaurant = await Restaurant.findOne({ user: req.userId });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        if (restaurantImage) {
            const cloudResponse = await cloudinary.uploader.upload(restaurantImage, { folder: "Restaurant_Image", });
            restaurant.imageURL = cloudResponse.secure_url || restaurant.imageURL;
        }

        restaurant.restaurantName = restaurantName;
        restaurant.city = city;
        restaurant.country = country;
        restaurant.cuisines = cuisines;
        restaurant.deliveryTime = deliveryTime;

        await restaurant.save();
        res.status(200).json({ message: "Restaurant updated successfully", restaurant });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });

    }
}

export const getRestaurantOrders = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.userId });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }        

        const orders = await Order.find({
            'orderItems.menuId': { $in: restaurant.menus } 
        });
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found" });
        }
        res.status(200).json({ orders });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();
        res.status(200).json({ message: "Order status updated" });        

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });

    }
}

// user controllers
export const searchRestaurant = async (req, res) => {
    try {
        const searchText = req.params.searchText || "";
        const selectedCuisines = (req.query.appliedFilter || "").split(",").filter(cuisine => cuisine);
        const searchQuery = req.query.searchQuery
        

        const query = {};
        // basic search based on searchText (restaurantName ,city, country)

        if (searchText) {
            query.$or = [
                { restaurantName: { $regex: searchText, $options: 'i' } },
                { city: { $regex: searchText, $options: 'i' } },
                { country: { $regex: searchText, $options: 'i' } },
                { cuisines: { $regex: searchText, $options: 'i' } }
            ]
        }
        // filter on the basis of searchQuery (restaurantName, cuisines)
        if (searchQuery && searchQuery !== "undefined") {
            query.$or = [
                { restaurantName: { $regex: searchQuery, $options: 'i' } },
                { cuisines: { $regex: searchQuery, $options: 'i' } }
            ]
        }
        // filter on the basis of selected Cuisines
        if (selectedCuisines.length > 0) {
            query.cuisines = { $in: selectedCuisines }
        }        
        const restaurants = await Restaurant.find(query);
        const cuisinesList = await Restaurant.distinct("cuisines");
        return res.status(200).json({ restaurants, cuisinesList });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });

    }
}

export const getSingleRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const restaurant = await Restaurant.findById(restaurantId).populate({
            path: 'menus',
            options: { createdAt: -1 }
        });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" })
        }
        res.status(200).json({ restaurant });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}