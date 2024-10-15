import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useUserStore } from "@/Stores/useUserStore";
import { useState } from "react";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");

  const { verifyEmail } = useUserStore();

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="p-8 rounded-md w-full max-w-md flex flex-col gap-10 border border-gray-200">
        <div className="text-center">
          <h1 className="font-extrabold text-2xl">Verify your email</h1>
          <p className="text-sm text-gray-600">
            Enter the 6 digit code sent to your email address
          </p>
        </div>
        <div className="flex justify-center">
          <InputOTP
            pattern="[0-9, A-Z, a-z]"
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            onComplete={() => { verifyEmail(otp);  setOtp("")}} >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="w-10 h-10 sm:w-16 sm:h-16 text-center text-xl border border-gray-300 rounded-md" />
              <InputOTPSlot index={1} className="w-10 h-10 sm:w-16 sm:h-16 text-center text-xl border border-gray-300 rounded-md" />
              <InputOTPSlot index={2} className="w-10 h-10 sm:w-16 sm:h-16 text-center text-xl border border-gray-300 rounded-md" />
              <InputOTPSlot index={3} className="w-10 h-10 sm:w-16 sm:h-16 text-center text-xl border border-gray-300 rounded-md" />
              <InputOTPSlot index={4} className="w-10 h-10 sm:w-16 sm:h-16 text-center text-xl border border-gray-300 rounded-md" />
              <InputOTPSlot index={5} className="w-10 h-10 sm:w-16 sm:h-16 text-center text-xl border border-gray-300 rounded-md" />
            </InputOTPGroup>
          </InputOTP>
        </div>

      </div>
    </div>
  );
};

export default VerifyEmail;