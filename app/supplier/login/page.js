"use client";

import React, { useState, useEffect, useRef } from "react";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { verifySupplierExists } from "./actions";
import { Loader2, ArrowRight, ShieldCheck, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";

export default function SupplierLoginPage() {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("INPUT"); // INPUT, OTP
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  // const verifierRef = useRef(null);

  // // 1. LIFECYCLE: One Verifier, One Container
  // useEffect(() => {
  //   // Only initialize if it doesn't exist and we have the container
  //   if (!verifierRef.current && typeof window !== "undefined") {
  //     try {
  //       verifierRef.current = new RecaptchaVerifier(
  //         auth,
  //         "recaptcha-container",
  //         {
  //           size: "normal", // Forces the checkbox v2
  //           callback: () => console.log("reCAPTCHA verified"),
  //           "expired-callback": () => {
  //             toast({
  //               title: "Expired",
  //               description: "Solve reCAPTCHA again.",
  //             });
  //           },
  //         },
  //       );

  //       verifierRef.current.render();
  //     } catch (err) {
  //       console.error("reCAPTCHA Setup Error:", err);
  //     }
  //   }

  //   // Cleanup on unmount to prevent "duplicate container" errors
  //   return () => {
  //     if (verifierRef.current) {
  //       verifierRef.current.clear();
  //       verifierRef.current = null;
  //     }
  //   };
  // }, [toast]);

  useEffect(() => {

    // We attach it to 'window' so it's globally accessible in our component
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          // This triggers when the user clicks the button and passes the "bot check"
        },
      },
    );

    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    };
  }, []);

  const handleSendOtp = async () => {
    if (phoneNumber.length !== 10) {
      toast({
        title: "Check Number",
        description: "Please enter 10 digits.",
        variant: "destructive",
      });
      return;
    }
const appVerifier = window.recaptchaVerifier;
    setLoading(true);

    try {

      await window.recaptchaVerifier.verify();
      const fullNumber = `+91${phoneNumber.trim()}`;

      // A. Database Stealth Check
      const check = await verifySupplierExists(fullNumber);
      if (!check.exists) {
        toast({
          title: "Not Authorized",
          description: "Number not found in our records.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // B. Firebase SMS Send
      const confirmation = await signInWithPhoneNumber(
        auth,
        fullNumber,
        appVerifier,
      );
      setConfirmationResult(confirmation);
      setStep("OTP");
    } catch (error) {
      console.error("Error during sign-in:", error);
      // Important: If it fails, the reCAPTCHA often needs to be reset
      appVerifier.render().then((widgetId) => {
        window.grecaptcha.reset(widgetId);
      });

      toast({
        title: "Error",
        description: "Failed to send SMS. Try again.",
        variant: "destructive",
      });
     
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();

      const nextAuthResult = await signIn("supplier-otp", {
        phoneNumber: `+91${phoneNumber}`,
        token: idToken,
        redirect: false,
      });

      if (nextAuthResult?.error) throw new Error("Portal sync failed");

      window.location.href = "/supplier/leads";
    } catch (error) {
      toast({
        title: "Invalid OTP",
        description: "The code is wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white border-2 border-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-[12px_12px_0px_0px_rgba(37,99,235,1)]">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
            PAR<span className="text-blue-600">TO</span>
          </h1>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mt-2">
            Supplier Portal
          </p>
        </header>

        {step === "INPUT" ? (
          <div className="space-y-6">
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-300">
                +91
              </span>
              <input
                type="tel"
                placeholder="70825XXXXX"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                className="w-full pl-16 pr-4 py-5 border-2 border-slate-100 rounded-2xl font-semibold text-[15px] outline-none focus:border-blue-600 bg-slate-50/50 transition-all"
              />
            </div>

            {/* Centered & Scaled reCAPTCHA container
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="bg-slate-50 border border-slate-100 p-2 rounded-2xl w-full flex justify-center overflow-hidden">
                <div
                  id="recaptcha-container"
                  className="scale-[0.85] sm:scale-100 origin-center"
                ></div>
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={12} className="text-blue-600" />
                Anti-Spam Verification Required
              </p>
            </div> */}

            <button
              // onClick={handleSendOTP}
              onClick={handleSendOtp}
              disabled={phoneNumber.length < 10 || loading}
              className="group w-full py-5 bg-slate-950 text-white font-black uppercase italic rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-20"
            >
              {loading ? <Loader2 className="animate-spin" /> : "GET OTP"}
              {!loading && (
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              )}
            </button>
          </div>
        ) : (
          <div className=" animate-in slide-in-from-right-8 duration-500">
            <div className="text-center mb-2">
              <p className="text-[12px] font-bold  text-slate-400">
                Enter code sent to +91 {phoneNumber}
              </p>
            </div>
            <input
              type="text"
              placeholder="0 0 0 0 0 0"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="w-full px-4 py-3 mb-6 border-2 border-slate-100 focus:border-blue-600 rounded-xl font-semibold text-center text-xl tracking-wider  outline-none bg-slate-50/50"
            />
            <button 
              onClick={handleVerifyOTP}
              disabled={otp.length < 6 || loading}
              className="w-full py-5 mb-6 bg-blue-600 text-white font-black uppercase italic rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Submit"
              )}
            </button>
            <button
              onClick={() => setStep("INPUT")}
              className="w-full text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-colors"
            >
              ← Change Number
            </button>
          </div>
        )}

        <p className="mt-4 text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] text-center leading-loose pt-8 border-t border-slate-50">
          Secured by{" "}
          <span className="text-slate-900">PARTO Identity Network</span>
        </p>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
}
