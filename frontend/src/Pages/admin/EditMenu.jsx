import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMenuStore } from "@/Stores/useMenuStore";
import { Loader2 } from "lucide-react";
import { useEffect, useState, } from "react";
import PropTypes from "prop-types";

const EditMenu = ({ selectedMenu, editOpen, setEditOpen, availableCuisines }) => {
    EditMenu.propTypes = {
        selectedMenu: PropTypes.object,
        editOpen: PropTypes.bool,
        setEditOpen: PropTypes.func,
        availableCuisines: PropTypes.array,
    };
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        name: "",
        description: "",
        cuisine: "",
        price: 0,
        image: undefined,
    });
    const { editMenu } = useMenuStore();

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

    const changeEventHandler = (e) => {
        const { name, value, type } = e.target;
        setInput({ ...input, [name]: type === "number" ? Number(value) : value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            let formData = {
                name: input.name,
                description: input.description,
                price: input.price,
                cuisine: input.cuisine,
            };
            if (input.image) {
                formData = { ...formData, image: input.image }
            }
            setLoading(true);
            await editMenu(selectedMenu._id, formData);
            setLoading(false);
            setEditOpen(false);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setInput({
            name: selectedMenu?.name || "",
            description: selectedMenu?.description || "",
            price: selectedMenu?.price || 0,
            image: undefined,
            cuisine: selectedMenu?.cuisine || "",
        });
    }, [selectedMenu]);
    return (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Menu</DialogTitle>
                    <DialogDescription>
                        Update your menu to keep your offerings fresh and exciting!
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
                        {loading ? (
                            <Button disabled className="bg-orange hover:bg-hoverOrange">
                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button className="bg-orange hover:bg-hoverOrange">Submit</Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditMenu;