import { useState } from "react";
import StatusTracker from "../components/StatusTracker";
import CitizenProfile from "../components/CitizenProfile";
import GrievanceStatus from "../components/GrievanceStatus";
import FeedbackForm from "../components/FeedbackForm";

const STATUS_MAP = {
  A7K3D9P2X4: "Pending",
  B8M1Q4T6Z9: "Submitted",
  C5R8V2N7Y1: "Under Review",
  D9X3K6P1W8: "In Progress",
  E2Z7M4S9T5: "Closed",
};

export default function TrackComplaint() {
  const [data, setData] = useState(null);

  const searchGrievance = (id) => {
    const status = STATUS_MAP[id] || "Closed";
    setData({
      profile: {
        name: "Arun Kumar",
        email: "arun@email.com",
        district: "Chennai",
        address: "Anna Nagar",
        phone: "9876543210",
        pincode: "600040",
      },
      grievance: {
        id,
        department: "Revenue Department",
        status,
        remarks: status === "Closed" ? "Streetlight repaired" : "Under processing",
        subject: "Delay in land patta transfer",
        description:
          "Applied for patta transfer 6 months ago. No update received despite multiple visits to the Taluk office.",
        proofUrl:
          "https://via.placeholder.com/600x400/0f766e/ffffff?text=Proof+Document",
      },
    });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <StatusTracker onSearch={searchGrievance} />

        {data && (
          <>
            <CitizenProfile profile={data.profile} grievance={data.grievance} />
            <GrievanceStatus grievance={data.grievance} />
            <FeedbackForm grievance={data.grievance} />
          </>
        )}
      </div>
    </div>
  );
}
