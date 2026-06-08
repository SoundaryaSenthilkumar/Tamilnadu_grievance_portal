import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { submitFeedback } from "../api";

export default function FeedbackForm({ grievance, onSubmitFeedback }) {
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!grievance || grievance.status !== "Closed") return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await submitFeedback(grievance.id, rating, comment);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        setComment("");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg border border-[#0f766e] p-6"
      style={{ marginBottom: '70px' }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0f766e]/10">
          <i className="fa-regular fa-comment-dots text-[#0f766e]"></i>
        </div>
        <h2 className="text-lg font-semibold text-[#0f766e]">{t('citizenFeedback')}</h2>
      </div>

      <hr className="mb-5" />

      {submitted && (
        <div className="bg-green-50 border border-green-500 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
          <i className="fa-solid fa-circle-check"></i>
          <span>{t('feedbackSuccess')}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wide mb-3 block">{t('rateExperience')}</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-3xl transition-all duration-200 hover:scale-110"
              >
                <span className={rating >= star ? "text-yellow-400" : "text-gray-300"}>
                  {rating >= star ? "★" : "☆"}
                </span>
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {rating === 1 && t('poor')}
              {rating === 2 && t('fair')}
              {rating === 3 && t('good')}
              {rating === 4 && t('veryGood')}
              {rating === 5 && t('excellent')}
            </p>
          )}
        </div>

        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">{t('yourFeedback')}</label>
          <textarea
            value={comment}
            placeholder={t('writeFeedback')}
            className="border border-gray-300 rounded-lg p-3 w-full h-32 focus:outline-none focus:ring-2 focus:ring-[#0f766e] resize-none"
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={rating === 0 || !comment.trim() || loading}
        className="bg-[#0f766e] hover:bg-[#0d5f58] text-white px-6 py-2 rounded-lg transition duration-300 mt-4 w-full disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <i className="fa-solid fa-paper-plane"></i>
        {loading ? "Submitting..." : t('submitFeedback')}
      </button>
    </form>
  );
}
