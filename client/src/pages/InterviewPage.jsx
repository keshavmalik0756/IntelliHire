import React, { useState } from "react";
import Step1SetUp from "../components/Step1SetUp";
import Step2Interview from "../components/Step2Interview";
import Step3Report from "../components/Step3Report";
import api from "../utils/api";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateCredits } from "../store/slices/authSlice";

const InterviewPage = () => {
    const [step, setStep] = useState(1);
    const [interviewData, setInterviewData] = useState(null);
    const dispatch = useDispatch();
    return(
        <div className="min-h-screen bg-gray-50">
            {
                step === 1 && (
                    <Step1SetUp onStart={async (data) => {
                        try {
                            // DEBUG: Log the exact payload being sent to the backend
                            console.log("📦 Sending to backend:", data);
                            // Hit our newly upgraded backend API via our global Axios instance
                            const response = await api.post("/interview/generate-questions", data);
                            
                            if (response.data.success) {
                                const payload = response.data.data;
                                
                                // PROOF LOGGING: Shows AI successfully generated 10 valid questions, 
                                // subtracted 50 credits, mapped the Schema IDs, and returned the user context.
                                console.log(`🚀 [BACKEND SUCCESS] Interview Created Successfully!`);
                                console.log(`🆔 Interview ID: ${payload.interviewId}`);
                                console.log(`👤 User: ${payload.user.username} | 💰 Remaining Credits: ${payload.user.creditsLeft}`);
                                console.log(`🧠 Generated Questions Array [${payload.questions.length}/10]:`, payload.questions);
                                console.log(`⚙️ Interview Details:`, payload.interviewDetails);
                                
                                // Instantly update credits in Navbar without re-login
                                dispatch(updateCredits(payload.user.creditsLeft));
                                setInterviewData(payload);
                                setStep(2);
                            } else {
                                toast.error(response.data.message || "Failed to generate interview");
                            }
                        } catch (error) {
                            console.error("Error generating interview:", error.response?.data || error.message);
                            toast.error(error.response?.data?.message || "Something went wrong generating questions.");
                        }
                    }}/>
                )
            }
            {
                step === 2 && (
                    <Step2Interview interviewData={interviewData} onFinish={(report) => {
                        setInterviewData(report);
                        setStep(3);
                    }}/>
                )
            }
            {
                step === 3 && (
                    <Step3Report report={interviewData}/>
                )
            }
        </div>
    );
};

export default InterviewPage;
