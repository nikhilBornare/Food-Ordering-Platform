import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import  {useRestaurantStore}  from "@/Stores/useRestaurantStore";


const SearchFilters = () => {

  const { appliedFilter, setAppliedFilter, resetAppliedFilter, filterOptions } = useRestaurantStore();
  console.log(filterOptions)
  return (
    <div className="md:w-64">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-lg">Filter by cuisines</h1>
        <Button onClick={()=>{resetAppliedFilter()}} variant={"link"} >Reset</Button>
      </div>
      {filterOptions.map((option, index) => (
        <div key={index} className="flex items-center space-x-2 my-5">
          <Checkbox
            id={option.id}
            checked={appliedFilter.includes(option)}
            onClick={() => setAppliedFilter(option)}
          />
          <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {option}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default SearchFilters;