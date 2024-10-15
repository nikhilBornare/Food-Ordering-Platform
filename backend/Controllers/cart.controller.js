import Menu from "../Models/menu.model.js";
import User from "../Models/user.model.js";

export const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('cartItems')
        const cartItems = await Menu.find({ _id: { $in: user.cartItems } })
        const cart = cartItems.map(cartItem => {
            const { name, price, imageURL, description } = cartItem;

            const quantity = user.cartItems.find(item => item._id.toString() === cartItem._id.toString()).quantity;
            return { name, price, imageURL, description, quantity, _id: cartItem._id };
        })

        res.status(200).json({ cart });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const addToCart = async (req, res) => {
    try {
        const { menuId } = req.body;
        const user = await User.findById(req.userId).select('cartItems');
        const existingProduct = user.cartItems.find(item => item._id.toString() === menuId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            user.cartItems.push({ _id: menuId });
        }
        await user.save();
        const menu = await Menu.findById(menuId);
        res.status(201).json({ message: `${menu.name} is Added to the Cart`, cart: user.cartItems });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.userId).select('cartItems');
        user.cartItems = user.cartItems.filter(item => item._id.toString() !== id);
        await user.save();

        res.status(200).json({ message: "Product removed from cart" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const updateQuantity = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const user = await User.findById(req.userId).select('cartItems');

        const existingProduct = user.cartItems.find(item => item._id.toString() === id);
        if (existingProduct) {
            existingProduct.quantity = quantity;
        }
        await user.save();
        return res.status(200).json({ cartItems: user.cartItems });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const clearCart = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('cartItems');
        user.cartItems = [];
        await user.save();
        res.status(200).json({ message: "Cart is cleared" });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });        
    }
}
