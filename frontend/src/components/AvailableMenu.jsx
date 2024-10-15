import { useCartStore } from "@/Stores/useCartStore";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import PropTypes from "prop-types";

const AvailableMenu = ({ menus }) => {
    AvailableMenu.propTypes = {
        menus: PropTypes.array,
  };
  
  const {addToCart} = useCartStore();

    const addToCartHandler = (menuId) => {
      addToCart(menuId);
    }

  return (
    <div className="md:p-4">
      <h1 className="text-xl md:text-2xl font-extrabold mb-6">
        Available Menus
      </h1>
      <div className="grid md:grid-cols-3 space-y-4 md:space-y-0">
        {menus.map((menu) => (
            
          <Card key={menu._id} className="w-60 mx-auto shadow-lg rounded-lg overflow-hidden">
            <img src={menu.imageURL} alt="" className="w-full h-40 object-cover" />
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">
                {menu.name}
              </h2>
              <p className="text-sm mt-2">{menu.description}</p>
              <h3 className="text-lg font-semibold mt-4">
                Price: <span className="text-[#D19254]">₹{menu.price}</span>
              </h3>
            </CardContent>
            <CardFooter className="p-4">
              <Button
                onClick={() => {
                  addToCartHandler(menu._id);
                }}
                className="w-full bg-orange hover:bg-hoverOrange"
              >
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AvailableMenu;