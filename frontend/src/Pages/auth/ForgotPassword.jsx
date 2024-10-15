import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useUserStore } from "@/Stores/useUserStore"
import { Loader2Icon, Mail } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"


const ForgotPassword = () => {

    const [email, setEmail] = useState('')
    const {loading, forgotPassword} = useUserStore()

    const handleSubmit = async(e) => {
        e.preventDefault()
        await forgotPassword(email)
        setEmail('')
    }
    return (
        <div className="flex items-center justify-center min-h-screen w-auto">
            <form onSubmit={handleSubmit} className="md:p-8 md:border border-gray-200 rounded-lg w-full max-w-md">
                <h1 className="mb-5 font-bold text-2xl">Forgot Password</h1>
                <h1 className="mb-2 text-gray-600">Enter email to reset your password</h1>
                <div className="relative">
                    <Input className="pl-10 focus-visible:ring-1" type="email" placeholder="Enter Your Email" value={email} onChange={e => setEmail(e.target.value)} />
                    <Mail className="absolute inset-y-2 pl-2 size-fit text-gray-500 pointer-events-none" />
                </div>
                <div className="mt-5">
                    {loading ?
                        <button disabled type="submit" className="flex justify-center items-center w-full bg-orange hover:bg-hoverOrange text-gray-300 py-2 rounded-md">
                            <Loader2Icon className="mr-2 size-6 animate-spin" /> Please Wwit...
                        </button>
                        :
                        <button type="submit" className="flex justify-center items-center w-full bg-orange hover:bg-hoverOrange text-white py-2 rounded-md">
                            Send reset link
                        </button>
                    }
                </div>
                <div className="mt-5">
                    <Separator/>
                    <h1>Back to{" "}
                        <Link to={'/login'} className="text-blue-500 hover:underline">Login</Link>
                    </h1>
                </div>

            </form>
        </div>
    )
}

export default ForgotPassword