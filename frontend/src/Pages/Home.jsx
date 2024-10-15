import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import HomeImage from "@/assets/hero_pizza.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  return (
    <div className=" flex flex-col md:flex-row max-w-7xl mx-auto md:p-10 rounded-lg items-center justify-center my-4 gap-20">
      <div className="flex flex-col gap-10 md:w-[40%]">
        <div className="flex flex-col gap-5">
          <h1 className="font-bold md:font-extrabold md:text-5xl text-4xl">
            Order Food anytime & anywhere
          </h1>
          <p className="text-gray-500">
            Hey! Our Delicios food is waiting for you, we are always near to
            you.
          </p>
        </div>
        <div >
          <form className="relative flex items-center gap-2">
          <Input
            type="text"
            value={searchText}
            placeholder="Search Cuisines & Restaurant by name, city & country"
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10 shadow-lg py-5"
          />
          <Search className="text-gray-500 absolute inset-y-2 left-2" />
          <Button onClick={() => navigate(`/search/${searchText}`)} className="bg-orange hover:bg-hoverOrange">Search</Button>
          </form>
        </div>
      </div>
      <div>
        <img 
        src={HomeImage} 
        alt="" 
        className="object-cover w-full max-h-[500px]"
        />
      </div>
    </div>
  );
};

export default Home;