import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import EditMenu from "./EditMenu";
import { useRestaurantStore } from "@/Stores/useRestaurantStore";
import { useMenuStore } from "@/Stores/useMenuStore";
import Loading from "@/components/Loading";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Menu = () => {
    const [btnLoading, setBtnLoading] = useState(false);
    const [input, setInput] = useState({
        name: "",
        description: "",
        price: 0,
        image: undefined,
        cuisine: "",
    });
    const { restaurant, getRestaurant } = useRestaurantStore()
    // Extract cuisines from restaurant's declared cuisines
    const availableCuisines = restaurant?.cuisines || [];

    const { addMenu, loading, getMenus, menus, deleteMenu } = useMenuStore();

    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState();

    const changeEventHandler = (e) => {
        const { name, value, type } = e.target;
        setInput({ ...input, [name]: type === "number" ? Number(value) : value });
    };
    const handleImageChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setInput({ ...input, image: reader.result });
            };
        }
    };

    const deleteHandler = async (id) => {
        try {
            setBtnLoading(true);
            await deleteMenu(id);
            setBtnLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        let formData = {
            name: input.name,
            description: input.description,
            price: input.price.toString(),
            cuisine: input.cuisine,
            image: input.image,

        };
        if (input.image) {
            formData = { ...formData, "image": input.image };
        }
        setBtnLoading(true);
        await addMenu(formData);
        setBtnLoading(false);
        setOpen(false);
    };


    useEffect(() => {
        getRestaurant();
    }, [getRestaurant]);

    useEffect(() => {
        getMenus();
    }, [getMenus]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="max-w-6xl mx-auto my-10">
            <div className="flex justify-between">
                <h1 className="font-bold md:font-extrabold text-lg md:text-2xl">
                    Available Menus
                </h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-orange hover:bg-hoverOrange">
                            <Plus className="mr-2" />
                            Add Menus
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add A New Menu</DialogTitle>
                            <DialogDescription>
                                Create a menu that will make your restaurant stand out.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submitHandler} className="space-y-4">
                            <div>
                                <Label>Cuisine</Label>
                                <Select
                                    onValueChange={(value) =>
                                        changeEventHandler({ target: { name: "cuisine", value } })
                                    }
                                    value={input.cuisine}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Cuisine" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {availableCuisines.map((cuisine, index) => (
                                                <SelectItem key={index} value={cuisine}>
                                                    {cuisine}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Name</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    value={input.name}
                                    onChange={changeEventHandler}
                                    placeholder="Enter menu name"
                                />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Input
                                    type="text"
                                    name="description"
                                    value={input.description}
                                    onChange={changeEventHandler}
                                    placeholder="Enter menu description"
                                />
                            </div>
                            <div>
                                <Label>Price in (Rupees)</Label>
                                <Input
                                    type="number"
                                    name="price"
                                    value={input.price}
                                    onChange={changeEventHandler}
                                    placeholder="Enter menu price"
                                />
                            </div>
                            <div>
                                <Label>Upload Menu Image</Label>
                                <Input
                                    type="file"
                                    name="image"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <DialogFooter className="mt-5">
                                {btnLoading ? (
                                    <Button disabled className="bg-orange hover:bg-hoverOrange">
                                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                        Please wait
                                    </Button>
                                ) : (
                                    <Button className="bg-orange hover:bg-hoverOrange">
                                        Submit
                                    </Button>
                                )}
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            {menus.map((menu, idx) => (
                <div key={idx} className="mt-6 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 md:p-4 p-2 shadow-md rounded-lg border">
                        <img
                            src={menu.imageURL}
                            alt=""
                            className="md:h-24 md:w-24 h-16 w-full object-cover rounded-lg"
                        />
                        <h1>Cuisine:{menu.cuisine}</h1>
                        <div className="flex-1">
                            <h1 className="text-lg font-semibold">
                                {menu.name}
                            </h1>
                            <p className="text-sm tex-gray-600 mt-1">{menu.description}</p>
                            <h2 className="text-md font-semibold mt-2">
                                Price: <span className="text-[#D19254]">{menu.price}</span>
                            </h2>
                        </div>
                        <Button className="bg-orange hover:bg-hoverOrange mt-2"
                            onClick={() => { setSelectedMenu(menu); setEditOpen(true); }}
                            size={"sm"}
                        >
                            Edit
                        </Button>
                        <Button size={"sm"} className="bg-red-500 hover:bg-red-600 mt-2"
                            onClick={() => deleteHandler(menu._id)}
                        >Delete
                        </Button>
                    </div>
                </div>
            ))}
            <EditMenu
                selectedMenu={selectedMenu}
                editOpen={editOpen}
                setEditOpen={setEditOpen}
                availableCuisines={availableCuisines}
            />
        </div>
    );
};


export default Menu;
