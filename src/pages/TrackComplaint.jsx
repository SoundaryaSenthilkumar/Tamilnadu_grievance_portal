import { useState } from "react";
import StatusTracker from "../components/StatusTracker";
import CitizenProfile from "../components/CitizenProfile";
import GrievanceStatus from "../components/GrievanceStatus";
import FeedbackForm from "../components/FeedbackForm";
import { trackComplaint, submitFeedback } from "../api";

export default function TrackComplaint() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const searchGrievance = async (token) => {
    setError("");
    setLoading(true);
    try {
      const result = await trackComplaint(token);
      setData({
        profile: {
          name: result.citizen_name,
          phone: result.phone,
          district: result.constituency || "",
          address: result.address_line1,
          pincode: result.address_line2 || "",
        },
        grievance: {
          id: result.token,
          department: result.department?.name || "",
          status: result.status,
          remarks: result.notes || "",
          subject: result.message?.substring(0, 60) || "",
          description: result.message,
          timeline: result.timeline?.map((t) => ({
            status: t.status,
            date: t.changed_at?.split("T")[0] || "",
            completed: true,
          })) || [],
        },
      });
    } catch (err) {
      setError(err.message || "Complaint not found");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (token, rating, comment) => {
    await submitFeedback(token, rating, comment);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <StatusTracker onSearch={searchGrievance} />

        {loading && (
          <p className="text-center text-teal-700 mt-6">Searching...</p>
        )}

        {error && (
          <p className="text-center text-red-600 mt-6">{error}</p>
        )}

        {data && (
          <>
            <CitizenProfile profile={data.profile} grievance={data.grievance} />
            <GrievanceStatus grievance={data.grievance} />
            <FeedbackForm grievance={data.grievance} onSubmitFeedback={handleFeedback} />
          </>
        )}
      </div>
    </div>
  );
}
