import { Loader2, LocateIcon, Mail, MapPin, MapPinnedIcon, Phone, Plus, } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/Stores/useUserStore";

const Profile = () => {
    const { loading, user, updateProfile } = useUserStore()

    const [profileData, setProfileData] = useState(user);

    const imageRef = useRef(null);
    const [selectedProfilePicture, setSelectedProfilePicture] = useState(profileData.profilePicture || "");

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedProfilePicture(reader.result);
                setProfileData((prevData) => ({ ...prevData, profilePicture: reader.result, }));
            };
            reader.readAsDataURL(file);
        }
    };

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const updateProfileHandler = async (e) => {
        e.preventDefault();
        await updateProfile(profileData);

    };

    return (
        <form onSubmit={updateProfileHandler} className="max-w-7xl mx-auto my-5 ">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar className="relative md:w-28 md:h-28 w-20 h-20">
                        <AvatarImage src={selectedProfilePicture} />
                        <AvatarFallback>CN</AvatarFallback>
                        <input
                            ref={imageRef}
                            className="hidden"
                            type="file"
                            accept="image/*"
                            onChange={fileChangeHandler}
                        />
                        <div
                            onClick={() => imageRef.current?.click()}
                            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded-full cursor-pointer"
                        >
                            <Plus className="text-white w-8 h-8" />
                        </div>
                    </Avatar>
                    <Input
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={changeHandler}
                        className="font-bold text-2xl outline-none border-none focus-visible:ring-transparent"
                    />
                </div>
            </div>
            <div className="grid md:grid-cols-4 md:gap-2 gap-3 my-10">
                <div className="flex items-center gap-4 rounded-sm p-2 border-2">
                    <Mail  />
                    <div className="w-full items-start flex flex-col">
                        <Label>Email</Label>
                        <input
                            disabled
                            name="email"
                            value={profileData.email}
                            onChange={changeHandler}
                            className="cursor-not-allowed w-full bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-sm p-2 border-2">
                    <Phone  />
                    <div className="w-full items-start flex flex-col">
                        <Label>Contact Number</Label>
                        <input
                            name="contactNumber"
                            value={profileData.contactNumber}
                            onChange={changeHandler}
                            className="w-full bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-sm p-2 border-2">
                    <LocateIcon  />
                    <div className="w-full items-start flex flex-col">
                        <Label>Address</Label>
                        <input
                            type="text"
                            name="address"
                            value={profileData.address}
                            onChange={changeHandler}
                            className="w-full bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-sm p-2 border-2">
                    <MapPin  />
                    <div className="w-full items-start flex flex-col">
                        <Label>City</Label>
                        <input
                            type="text"
                            name="city"
                            value={profileData.city}
                            onChange={changeHandler}
                            className="w-full bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-sm p-2 border-2">
                    <MapPinnedIcon  />
                    <div className="w-full items-start flex flex-col">
                        <Label>Country</Label>
                        <input
                            type="text"
                            name="country"
                            value={profileData.country}
                            onChange={changeHandler}
                            className="w-full bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 rounded-sm p-2 border-2">
                    <MapPinnedIcon />
                    <div className="w-full items-start flex flex-col">
                        <Label>Pincode</Label>
                        <input
                            type="text"
                            name="pincode"
                            value={profileData.pincode}
                            onChange={changeHandler}
                            className="w-full bg-transparent focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
                        />
                    </div>
                </div>
            </div>
            <div className="text-center">
                {loading ? (
                    <Button disabled className="bg-orange hover:bg-hoverOrange">
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        Please wait
                    </Button>
                ) : (
                    <Button type="submit" className="bg-orange hover:bg-hoverOrange">Update</Button>
                )}
            </div>
        </form>
    );
};

export default Profile;