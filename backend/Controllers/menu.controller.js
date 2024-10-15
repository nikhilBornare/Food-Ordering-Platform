import Restaurant from "../Models/restaurant.model.js";
import Menu from "../Models/menu.model.js";
import cloudinary from "../utils/cloudinary.js";


export const getMenus = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.userId });
        if (!restaurant) {
            return res.status(404).json({ message: "Please Add Your Restaurant First" });
        }
        const menus = await Menu.find({ restaurant: restaurant._id });
        if (!menus) {
            return res.status(404).json({ message: "Menus not found" });
        }
        res.status(200).json({ menus });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });

    }
}

export const addMenu = async (req, res) => {
    try {
        const { name, price, description, image, cuisine } = req.body;

        if (!name || !price || !description || !image || !cuisine) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const restaurant = await Restaurant.findOne({ user: req.userId });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        const response = await cloudinary.uploader.upload(image, {
            folder: "Restaurant_Menu_Images",
        });

        const newMenu = new Menu({
            restaurant: restaurant._id,
            name,
            price,
            description,
            cuisine,
            imageURL: response.secure_url,
        });
        await newMenu.save();
        restaurant.menus.push(newMenu._id);
        await restaurant.save();
        res.status(201).json({ message: "Menu added successfully", menu: newMenu });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });

    }
};

export const editMenu = async (req, res) => {
    try {
        const { name, price, description, image, cuisine } = req.body;
        const menu = await Menu.findById(req.params.id);
        if (!menu) {
            return res.status(404).json({ message: "Menu not found" });
        }
        if (image) {
            const response = await cloudinary.uploader.upload(image, {
                folder: "Restaurant_Menu_Images",
            });
            menu.imageURL = response.secure_url;
        }
        menu.name = name;
        menu.price = price;
        menu.cuisine = cuisine;
        menu.description = description;
        await menu.save();
        res.status(200).json({ message: "Menu updated successfully", menu });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });

    }
}

export const deleteMenu = async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id);
        if (!menu) {
            return res.status(404).json({ message: "Menu not found" });
        }
        const restaurant = await Restaurant.findOne({ user: req.userId });
        restaurant.menus = restaurant.menus.filter((m) => m.toString() !== menu._id.toString());
        await restaurant.save();

        await Menu.deleteOne({ _id: req.params.id });
        
        res.status(200).json({ message: "Menu deleted successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });

    }
}