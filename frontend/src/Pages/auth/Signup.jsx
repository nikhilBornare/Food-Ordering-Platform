import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { Loader2Icon, LockKeyhole, Mail, Phone, User } from "lucide-react"
import { Link } from "react-router-dom"
import { useUserStore } from "@/Stores/useUserStore"



const Signup = () => {
  const [input, setInput] = useState({
    fullName: "",
    email: "",
    password: "",
    contactNumber: ""
  })
  const { loading, signup } = useUserStore()
  const handleSubmit = async(e) => {
    e.preventDefault()
    await signup(input)
  }
  return (
    <div className="flex items-center justify-center min-h-screen w-auto">
      <form className="md:p-8 md:border border-gray-200 rounded-lg w-full max-w-md">
        <h1 className="mb-5 font-bold text-2xl">Create Your Account</h1>

        <div className="relative">
          <Input className="pl-10 focus-visible:ring-1" type="text" placeholder="Full Name" value={input.fullName} onChange={e => setInput({ ...input, fullName: e.target.value })} />
          <User className="absolute inset-y-2 pl-2 size-fit text-gray-500 pointer-events-none" />
        </div>


        <div className="relative mt-2">
          <Input className="pl-10 focus-visible:ring-1" type="email" placeholder="Email" value={input.email} onChange={e => setInput({ ...input, email: e.target.value })} />
          <Mail className="absolute inset-y-2 pl-2 size-fit text-gray-500 pointer-events-none" />
        </div>


        <div className="relative mt-2">
          <Input className="pl-10 focus-visible:ring-1" type="password" placeholder="Password" value={input.password} onChange={e => setInput({ ...input, password: e.target.value })} />
          <LockKeyhole className="absolute inset-y-2 pl-2 size-fit text-gray-500 pointer-events-none" />
        </div>


        <div className="relative mt-2">
          <Input className="pl-10 focus-visible:ring-1" type="text" placeholder="Contact" value={input.contactNumber} onChange={e => setInput({ ...input, contactNumber: e.target.value })} />
          <Phone className="absolute inset-y-2 pl-2 size-fit text-gray-500 pointer-events-none" />
        </div>


        <div className="mt-5">
          {loading ?
            <button disabled type="submit" className="flex justify-center items-center w-full bg-hoverOrange text-gray-300 py-2 rounded-md">
              <Loader2Icon className="mr-2 size-6 animate-spin" /> Please Wwit...
            </button>
            :
            <button onClick={handleSubmit} type="submit" className="flex justify-center items-center w-full bg-orange hover:bg-hoverOrange text-white  py-2 rounded-md">
              Signup
            </button>
          }

        </div>
        <div className="mt-5">
          <Separator />
          <h1>Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
          </h1>
        </div>


      </form>
    </div>

  )
}

export default Signup