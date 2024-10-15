import { useState } from "react"
import { Loader2Icon, LockIcon, Mail } from "lucide-react"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useUserStore } from "@/Stores/useUserStore"

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    })
    const { loading, login } = useUserStore()
    const handleSubmit = async (e) => {
        e.preventDefault()
        await login(input)
    }
    return (
        <div className="flex items-center justify-center min-h-screen w-auto">
            <form onSubmit={handleSubmit} className="md:p-8 md:border border-gray-200 rounded-lg w-full max-w-md">
                <h1 className="mb-5 font-bold text-2xl">Login Into Your Account</h1>
                <div className="relative">
                    <Input className="pl-10 focus-visible:ring-1" type="email" placeholder="Email" value={input.email} onChange={e => setInput({ ...input, email: e.target.value })} />
                    <Mail className="absolute inset-y-2 pl-2 size-fit text-gray-500 pointer-events-none" />
                </div>
                <div className="relative mt-2">
                    <Input className="pl-10 focus-visible:ring-1" type="password" placeholder="Password" value={input.password} onChange={e => setInput({ ...input, password: e.target.value })} />
                    <LockIcon className="absolute inset-y-2 pl-2 size-fit text-gray-500 pointer-events-none" />
                </div>
                <div className="mt-5">
                    {loading ?
                        <button disabled type="submit" className="flex justify-center items-center w-full bg-hoverOrange text-gray-300 py-2 rounded-md">
                            <Loader2Icon className="mr-2 size-6 animate-spin" /> Please Wait...
                        </button>
                        :
                        <button type="submit" className="flex justify-center items-center w-full bg-orange hover:bg-hoverOrange text-white py-2 rounded-md">
                            Login
                        </button>
                    }

                </div>
                <div className="mt-3 mb-2">
                    <Link to="/forgot-password" className="hover:text-blue-500 hover:underline">Forgot Password?</Link>
                </div>
                <Separator />
                <h1>Don&apos;t have an account?{" "}
                    <Link to="/signup" className="text-blue-500 hover:underline">Signup</Link>
                </h1>


            </form>
        </div>

    )
}

export default Login