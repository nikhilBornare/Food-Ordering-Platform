import stripe from '../utils/stripe.js';
import dotenv from "dotenv";
import Order from '../Models/order.model.js';
import User from '../Models/user.model.js';

dotenv.config();

export const createCheckoutSession = async (req, res) => {
    try {
        const { checkoutData } = req.body;
        if (!Array.isArray(checkoutData.cartItems) || checkoutData.cartItems.length === 0) {
            return res.status(400).json({ message: "Please add some products to your cart." });
        }

        let totalAmount = 0;

        const lineItems = checkoutData.cartItems.map(item => {
            const amount = Math.round(item.price * 100); // converting to cents
            totalAmount += (amount * item.quantity)

            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.name,
                        images: [item.image],
                    },
                    unit_amount: amount,
                },
                quantity: item.quantity,
            }

        })
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/order-success/?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cart`,
            metadata: {
                userId: req.userId,
                deliveryAddress: JSON.stringify(checkoutData.deliveryDetails),
                orderItems: JSON.stringify(checkoutData.cartItems.map(item => ({
                    menuId: item.menuId,
                    name: item.name,
                    price: item.price,
                    imageURL: item.image,
                    quantity: item.quantity,
                }
                ))),
            }
        });

        const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
        res.status(200).json({ message: "Checking Out...", stripePublishableKey, id: session.id, totalAmount: totalAmount / 100 });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const checkoutSuccess = async (req, res) => {
    try {
        const { session_id } = req.body;
        try {
            const session = await stripe.checkout.sessions.retrieve(session_id);
            if (session.payment_status === "paid") {

                const checkoutProducts = JSON.parse(session.metadata.orderItems);
                const deliveryAddress = JSON.parse(session.metadata.deliveryAddress);

                const newOrder = new Order({
                    user: session.metadata.userId,
                    deliveryAddress: deliveryAddress,
                    orderItems: checkoutProducts.map(product => ({
                        menuId: product.menuId,
                        name: product.name,
                        price: product.price,
                        imageURL: product.imageURL,
                        quantity: product.quantity,
                    })),
                    totalAmount: session.amount_total / 100,
                    stripeSessionId: session_id,
                });
                const isOrderExist = await Order.findOne({ stripeSessionId: session_id });
                if (!isOrderExist) {
                    await newOrder.save();
                    const user = await User.findById(req.userId).select('cartItems');
                    user.cartItems = [];
                    await user.save();
                    return res.status(200).json({ message: "Order placed successfully", newOrder });
                }
                res.status(200).json({ message: "Order already placed", newOrder: isOrderExist });

            }
        } catch (error) {
            return res.status(404).json({ message: "No such checkout session,", newOrder: "No order Found" });
        }

    } catch (error) {
        console.log('Error in checkoutSuccess controller', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

