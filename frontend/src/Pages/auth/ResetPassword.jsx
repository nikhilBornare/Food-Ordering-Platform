import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useUserStore } from "@/Stores/useUserStore"
import { Loader2Icon, LockKeyhole, } from "lucide-react"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"


const ResetPassword = () => {

    const [input, setInput] = useState({
        password: "",
        confirmPassword: "",
    })
    const { loading, resetPassword } = useUserStore()

    const resetToken = useParams().resetToken

    const handleSubmit = async(e) => {
        e.preventDefault()
        if (input.password !== input.confirmPassword) {
            toast.error("Passwords do not match")
        }
        await resetPassword(resetToken, input.password)
        setInput({ password: "", confirmPassword: "" })

    }
    return (
        <div className="flex items-center justify-center min-h-screen w-auto">
            <form onSubmit={handleSubmit} className="md:p-8 md:border border-gray-200 rounded-lg w-full max-w-md">
                <h1 className="mb-5 font-bold text-2xl">Reset Password</h1>
                <h1 className="mb-2 text-gray-600">Enter your new password</h1>
                <div className="relative">
                    <Input className="pl-10 focus-visible:ring-1" type="password" placeholder="New Password" value={input.password} onChange={e => setInput({ ...input, password: e.target.value })} />
                    <LockKeyhole className="absolute inset-y-2 pl-2 size-fit text-gray-500 pointer-events-none" />
                </div>
                <div className="relative mt-2">
                    <Input className="pl-10 focus-visible:ring-1" type="password" placeholder="Confirm New Password" value={input.confirmPassword} onChange={e => setInput({ ...input, confirmPassword: e.target.value })} />
                    <LockKeyhole className="absolute inset-y-2 pl-2 size-fit text-gray-500 pointer-events-none" />
                </div>
                <div className="mt-5">
                    {loading ?
                        <button disabled type="submit" className="flex justify-center items-center w-full bg-orange hover:bg-hoverOrange text-gray-300 py-2 rounded-md">
                            <Loader2Icon className="mr-2 size-6 animate-spin" /> Please Wwit...
                        </button>
                        :
                        <button type="submit" className="flex justify-center items-center w-full bg-orange hover:bg-hoverOrange text-white  py-2 rounded-md">
                            Reset Password
                        </button>
                    }
                </div>
                <div className="mt-5">
                    <Separator />
                    <h1>Back to{" "}
                        <Link to={'/login'} className="text-blue-500 hover:underline">Login</Link>
                    </h1>
                </div>

            </form>
        </div>
    )
}

export default ResetPassword

