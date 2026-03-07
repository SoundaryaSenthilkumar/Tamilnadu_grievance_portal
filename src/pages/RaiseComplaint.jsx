import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
import { useLanguage } from "../context/LanguageContext";

const departments = [
  { id: "pwd", en: "Public Works Department", ta: "பொதுப்பணித்துறை" },
  { id: "health", en: "Health Department", ta: "சுகாதாரத் துறை" },
  { id: "revenue", en: "Revenue Department", ta: "வருவாய் துறை" },
  { id: "police", en: "Police Department", ta: "காவல் துறை" },
  { id: "education", en: "Education Department", ta: "கல்வித்துறை" },
  { id: "municipal", en: "Municipal Services", ta: "நகராட்சி சேவைகள்" },
];

const constituencies = [
  { id: "mettupalayam", en: "Mettupalayam", ta: "மேட்டுப்பாளையம்" },
  { id: "sulur", en: "Sulur", ta: "சூலூர்" },
  { id: "kavundampalayam", en: "Kavundampalayam", ta: "கவுண்டம்பாளையம்" },
  { id: "coimbatore-north", en: "Coimbatore North", ta: "கோயம்புத்தூர் வடக்கு" },
  { id: "thondamuthur", en: "Thondamuthur", ta: "தொண்டாமுத்தூர்" },
  { id: "coimbatore-south", en: "Coimbatore South", ta: "கோயம்புத்தூர் தெற்கு" },
  { id: "singanallur", en: "Singanallur", ta: "சிங்காநல்லூர்" },
  { id: "kinathukadavu", en: "Kinathukadavu", ta: "கிணத்துக்கடவு" },
  { id: "pollachi", en: "Pollachi", ta: "பொள்ளாச்சி" },
  { id: "valparai-reserved", en: "Valparai (Reserved)", ta: "வால்பாறை (ஒதுக்கீடு)" },
];

const initialState = {
  name: "",
  department: "",
  constituency: "",
  addressLine1: "",
  addressLine2: "",
  phone: "",
  message: "",
  attachmentNames: [],
  attachmentItems: [],
  cameraMediaNames: [],
  cameraMediaItems: [],
};

function generateToken() {
  const letters = Array.from({ length: 5 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join("");
  const numbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join("");
  return `${letters}${numbers}`;
}

function isNewTokenFormat(token) {
  return /^[A-Z]{5}\d{5}$/.test(token || "");
}

function normalizeComplaintTokens(records) {
  return records.map((record) => ({
    ...record,
    token: isNewTokenFormat(record.token) ? record.token : generateToken(),
  }));
}

function decodeMojibakeTamil(value) {
  if (typeof value !== "string") return value;
  if (/[\u0B80-\u0BFF]/.test(value)) return value;
  if (!/(?:Ã|Â|à®|à¯|â|ðŸ)/.test(value)) return value;
  try {
    const viaEscape = decodeURIComponent(escape(value));
    if (/[\u0B80-\u0BFF]/.test(viaEscape)) return viaEscape;
  } catch {
    // Fall back to byte-based decode below.
  }
  try {
    const bytes = Uint8Array.from(Array.from(value), (char) => char.charCodeAt(0) & 0xff);
    const decoded = new TextDecoder("utf-8").decode(bytes);
    return /[\u0B80-\u0BFF]/.test(decoded) ? decoded : value;
  } catch {
    return value;
  }
}

function decodeTamilObject(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, decodeMojibakeTamil(value)])
  );
}

function getDepartmentLabel(value, isTamil) {
  const found = departments.find((dep) => dep.id === value || dep.en === value);
  if (!found) return value || "";
  return isTamil ? decodeMojibakeTamil(found.ta) : found.en;
}

function getConstituencyLabel(value, isTamil) {
  const found = constituencies.find((item) => item.id === value || item.en === value || item.ta === value);
  if (!found) return value || "";
  return isTamil ? decodeMojibakeTamil(found.ta) : found.en;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function revokePreviewUrl(url) {
  if (typeof url === "string" && url.startsWith("blob:")) URL.revokeObjectURL(url);
}

export default function RaiseComplaint() {
  const { language } = useLanguage();
  const isTamil = language === "ta";
  const cameraInputRef = useRef(null);
  const liveVideoRef = useRef(null);
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState(() => localStorage.getItem("currentComplaintToken") ?? "");
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState("");
  const [capturedPreviewUrls, setCapturedPreviewUrls] = useState([]);
  const [fullscreenPreviewUrl, setFullscreenPreviewUrl] = useState("");
  const [currentUserPhone, setCurrentUserPhone] = useState(() => localStorage.getItem("currentUserPhone") ?? "");
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem("complaintRecords");
    if (!saved) return [];

    try {
      const parsed = JSON.parse(saved);
      const normalized = normalizeComplaintTokens(parsed);
      localStorage.setItem("complaintRecords", JSON.stringify(normalized));
      return normalized;
    } catch {
      return [];
    }
  });

  const ui = isTamil
    ? {
        formTitle: "பொதுமக்கள் குறைதீர் புகார் படிவம்",
        formSubTitle: "தொடர்புடைய துறைக்கு உங்கள் புகாரை சமர்ப்பிக்கவும்.",
        fullName: "முழு பெயர்",
        department: "துறை",
        selectDepartment: "துறையை தேர்வு செய்யவும்",
        constituency: "தொகுதி",
        selectConstituency: "தொகுதியை தேர்வு செய்யவும்",
        address: "முகவரி",
        pincode: "அஞ்சல் குறியீடு",
        phoneNumber: "தொலைபேசி எண்",
        complaintMessage: "புகார் விவரம்",
        uploadFile: "கோப்பு பதிவேற்றம்",
        uploadFromCamera: "கேமரா மூலம் பதிவேற்றம்",
        submitComplaint: "புகார் சமர்ப்பிக்கவும்",
        submittedSuccess: "புகார் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது. உங்கள் டோக்கன்:",
        submittedComplaints: "சமர்ப்பிக்கப்பட்ட புகார்கள்",
        token: "டோக்கன்",
        name: "பெயர்",
        phone: "தொலைபேசி",
        submittedAt: "சமர்ப்பித்த தேதி/நேரம்",
        download: "பதிவிறக்கம்",
        cameraPreview: "கேமரா முன்னோட்டம்",
        takePhoto: "புகைப்படம் எடு",
        closeCamera: "கேமரா மூடு",
        close: "மூடு",
        placeholderName: "உங்கள் பெயரை உள்ளிடவும்",
        placeholderAddress: "வீட்டு எண், தெரு",
        placeholderPincode: "அஞ்சல் குறியீட்டை உள்ளிடவும்",
        placeholderPhone: "10 இலக்க மொபைல் எண்",
        placeholderMessage: "உங்கள் குறையை விரிவாக விளக்கவும்",
        errName: "பெயர் அவசியம்.",
        errDepartment: "துறை அவசியம்.",
        errConstituency: "தொகுதி அவசியம்.",
        errAddress: "முகவரி வரி 1 அவசியம்.",
        errPhone: "தொலைபேசி எண் 10 இலக்கமாக இருக்க வேண்டும்.",
        errMessage: "புகார் விவரம் குறைந்தது 10 எழுத்துகள் இருக்க வேண்டும்.",
        cameraPermission: "கேமரா அனுமதி இல்லை அல்லது கிடைக்கவில்லை. கோப்பு பதிவேற்றம் பயன்படுத்தப்படுகிறது.",
        cameraNotReady: "கேமரா இன்னும் தயாராகவில்லை. சில விநாடிகள் கழித்து முயற்சிக்கவும்.",
        cameraUnavailable: "இந்த சாதனத்தில் புகைப்படம் எடுக்க முடியவில்லை.",
        captureFailed: "புகைப்படம் எடுப்பதில் தோல்வி. மீண்டும் முயற்சிக்கவும்.",
        downloadComplaint: "புகாரை பதிவிறக்கவும்",
        viewFullscreen: "முழுத்திரையில் காண்க",
        fileToken: "டோக்கன்",
        fileName: "பெயர்",
        fileDepartment: "துறை",
        fileConstituency: "தொகுதி",
        fileAddress: "முகவரி",
        filePincode: "அஞ்சல் குறியீடு",
        filePhone: "தொலைபேசி",
        fileMessage: "புகார் விவரம்",
        fileUploads: "பதிவேற்றப்பட்ட கோப்புகள்",
        fileCameraUploads: "கேமரா பதிவேற்றங்கள்",
        fileSubmittedAt: "சமர்ப்பித்த தேதி/நேரம்",
      }
    : {
        formTitle: "Public Grievance Complaint Form",
        formSubTitle: "Submit your complaint to the concerned department.",
        fullName: "Full Name",
        department: "Department",
        selectDepartment: "Select department",
        constituency: "Constituency",
        selectConstituency: "Select constituency",
        address: "Address",
        pincode: "Pincode",
        phoneNumber: "Phone Number",
        complaintMessage: "Complaint Message",
        uploadFile: "Upload File",
        uploadFromCamera: "Upload from Camera",
        submitComplaint: "Submit Complaint",
        submittedSuccess: "Complaint submitted successfully. Your token:",
        submittedComplaints: "Submitted Complaints",
        token: "Token",
        name: "Name",
        phone: "Phone",
        submittedAt: "Submitted At",
        download: "Download",
        cameraPreview: "Camera Preview",
        takePhoto: "Take Photo",
        closeCamera: "Close Camera",
        close: "Close",
        placeholderName: "Enter your name",
        placeholderAddress: "House no., street",
        placeholderPincode: "Enter pincode",
        placeholderPhone: "10-digit mobile number",
        placeholderMessage: "Describe your grievance in detail",
        errName: "Name is required.",
        errDepartment: "Department is required.",
        errConstituency: "Constituency is required.",
        errAddress: "Address line 1 is required.",
        errPhone: "Phone must be exactly 10 digits.",
        errMessage: "Message should be at least 10 characters.",
        cameraPermission: "Camera permission denied or not available. Using file upload instead.",
        cameraNotReady: "Camera is not ready yet. Please wait and try again.",
        cameraUnavailable: "Unable to capture photo on this device.",
        captureFailed: "Capture failed. Please try again.",
        downloadComplaint: "Download complaint",
        viewFullscreen: "View full screen",
        fileToken: "Token",
        fileName: "Name",
        fileDepartment: "Department",
        fileConstituency: "Constituency",
        fileAddress: "Address",
        filePincode: "Pincode",
        filePhone: "Phone",
        fileMessage: "Complaint Message",
        fileUploads: "Uploaded Files",
        fileCameraUploads: "Camera Uploads",
        fileSubmittedAt: "Submitted At",
      };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = ui.errName;
    if (!formData.department) nextErrors.department = ui.errDepartment;
    if (!formData.constituency) nextErrors.constituency = ui.errConstituency;
    if (!formData.addressLine1.trim()) nextErrors.addressLine1 = ui.errAddress;
    if (!/^\d{10}$/.test(formData.phone)) nextErrors.phone = ui.errPhone;
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      nextErrors.message = ui.errMessage;
    }

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    const generatedToken = generateToken();
    const complaintRecord = {
      token: generatedToken,
      ...formData,
      submittedAt: new Date().toISOString(),
    };

    setComplaints((prev) => {
      const updated = [...prev, complaintRecord];
      localStorage.setItem("complaintRecords", JSON.stringify(updated));
      return updated;
    });

    setCurrentUserPhone(formData.phone);
    localStorage.setItem("currentUserPhone", formData.phone);
    setToken(generatedToken);
    localStorage.setItem("currentComplaintToken", generatedToken);
    setShowSubmittedModal(true);
    setFormData(initialState);
    capturedPreviewUrls.forEach((url) => revokePreviewUrl(url));
    setCapturedPreviewUrls([]);
  };

  const currentComplaint = token ? complaints.find((record) => record.token === token) ?? null : null;

  const handleAttachmentChange = async (event) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    const attachmentItems = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type || "application/octet-stream",
        dataUrl: await fileToDataUrl(file),
      }))
    );
    setFormData((prev) => ({
      ...prev,
      attachmentNames: [...prev.attachmentNames, ...files.map((file) => file.name)],
      attachmentItems: [...prev.attachmentItems, ...attachmentItems],
    }));
    event.target.value = "";
  };

  const handleCameraCapture = async (event) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    const cameraItems = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type || "application/octet-stream",
        dataUrl: await fileToDataUrl(file),
      }))
    );
    setFormData((prev) => ({
      ...prev,
      cameraMediaNames: [...prev.cameraMediaNames, ...files.map((file) => file.name)],
      cameraMediaItems: [...prev.cameraMediaItems, ...cameraItems],
    }));
    setCapturedPreviewUrls((prev) => [
      ...prev,
      ...cameraItems.filter((file) => file.type.startsWith("image/")).map((file) => file.dataUrl),
    ]);
    event.target.value = "";
  };

  const removeAttachment = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      attachmentNames: prev.attachmentNames.filter((_, index) => index !== indexToRemove),
      attachmentItems: prev.attachmentItems.filter((_, index) => index !== indexToRemove),
    }));
  };

  const removeCameraMedia = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      cameraMediaNames: prev.cameraMediaNames.filter((_, index) => index !== indexToRemove),
      cameraMediaItems: prev.cameraMediaItems.filter((_, index) => index !== indexToRemove),
    }));
    setCapturedPreviewUrls((prev) => {
      const removed = prev[indexToRemove];
      revokePreviewUrl(removed);
      return prev.filter((_, index) => index !== indexToRemove);
    });
  };

  const stopCamera = () => {
    if (!cameraStream) return;
    cameraStream.getTracks().forEach((track) => track.stop());
    setCameraStream(null);
  };

  const openCamera = async () => {
    setCameraError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      cameraInputRef.current?.click();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      setCameraStream(stream);
    } catch {
      cameraInputRef.current?.click();
      setCameraError(ui.cameraPermission);
    }
  };

  const handleTakePhoto = () => {
    const video = liveVideoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      setCameraError(ui.cameraNotReady);
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      setCameraError(ui.cameraUnavailable);
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError(ui.captureFailed);
          return;
        }
        const fileName = `camera-${Date.now()}.jpg`;
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
        setFormData((prev) => ({
          ...prev,
          cameraMediaNames: [...prev.cameraMediaNames, fileName],
          cameraMediaItems: [
            ...prev.cameraMediaItems,
            {
              name: fileName,
              type: "image/jpeg",
              dataUrl,
            },
          ],
        }));
        setCapturedPreviewUrls((prev) => [...prev, dataUrl]);
        setCameraError("");
      },
      "image/jpeg",
      0.92
    );
  };

  useEffect(() => {
    if (!liveVideoRef.current || !cameraStream) return;
    liveVideoRef.current.srcObject = cameraStream;
  }, [cameraStream]);

  useEffect(() => () => stopCamera(), [cameraStream]);
  useEffect(
    () => () => {
      capturedPreviewUrls.forEach((url) => revokePreviewUrl(url));
    },
    [capturedPreviewUrls]
  );

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const handleDownload = async (item) => {
    const uploadedFiles = item.attachmentNames ?? (item.attachmentName ? [item.attachmentName] : []);
    const cameraFiles = item.cameraMediaNames ?? (item.capturedPhotoName ? [item.capturedPhotoName] : []);
    const attachmentItems = item.attachmentItems ?? [];
    const cameraItems = item.cameraMediaItems ?? [];
    const allMediaItems = [...attachmentItems, ...cameraItems];
    const mediaUploads = allMediaItems.length
      ? allMediaItems.map((media) => media.name)
      : [...uploadedFiles, ...cameraFiles];
    const formattedDate = item.submittedAt ? new Date(item.submittedAt).toLocaleString() : "";
    const fileName = `${item.token || "complaint"}.pdf`;
    const generationTime = new Date().toLocaleString();
    const rowPairs = [
      [ui.fileName, item.name ?? ""],
      [ui.fileDepartment, getDepartmentLabel(item.department, isTamil)],
      [ui.fileConstituency, getConstituencyLabel(item.constituency, isTamil)],
      [ui.fileAddress, item.addressLine1 ?? ""],
      [ui.filePincode, item.addressLine2 ?? ""],
      [ui.filePhone, item.phone ?? ""],
      [ui.fileMessage, item.message ?? ""],
      [ui.fileUploads, mediaUploads.length ? mediaUploads.join(", ") : "-"],
    ];

    const rowMarkup = rowPairs
      .map(
        ([label, value]) => `
          <div class="row">
            <div class="label">${escapeHtml(label)}</div>
            <div class="value">${escapeHtml(value)}</div>
          </div>
        `
      )
      .join("");

    const template = `
      <div class="sheet">
        <style>
          * { box-sizing: border-box; }
          .sheet {
            width: 560px;
            padding: 18px;
            background: #ffffff;
            color: #0f172a;
            font-family: "Segoe UI", "Noto Sans Tamil", "Latha", Arial, sans-serif;
          }
          .topBand {
            height: 8px;
            border-radius: 8px;
            background: linear-gradient(90deg, #0f766e, #0ea5a4);
            margin-bottom: 12px;
          }
          .header {
            display: flex;
            gap: 16px;
            align-items: center;
            border: 1px solid #99f6e4;
            background: #f0fdfa;
            border-radius: 12px;
            padding: 10px 12px;
          }
          .badge {
            width: 44px;
            height: 44px;
            border-radius: 999px;
            border: 2px solid #0f766e;
            color: #0f766e;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 13px;
            flex: none;
          }
          .heading {
            margin: 0;
            font-size: 17px;
            font-weight: 700;
            color: #115e59;
            line-height: 1.2;
          }
          .subHeading {
            margin: 4px 0 0;
            color: #0f766e;
            font-size: 10px;
          }
          .metaGrid {
            margin-top: 10px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
          .metaItem {
            border: 1px solid #d1fae5;
            background: #f8fffe;
            border-radius: 10px;
            padding: 8px 10px;
          }
          .metaLabel {
            color: #0f766e;
            font-size: 10px;
            font-weight: 600;
            margin-bottom: 3px;
          }
          .metaValue {
            color: #0f172a;
            font-size: 11px;
            font-weight: 600;
            word-break: break-word;
          }
          .panel {
            margin-top: 10px;
            border: 1px solid #bfdbfe;
            border-radius: 12px;
            overflow: hidden;
          }
          .panelTitle {
            margin: 0;
            padding: 8px 10px;
            background: #eff6ff;
            color: #1d4ed8;
            font-size: 11px;
            font-weight: 700;
          }
          .row {
            display: grid;
            grid-template-columns: 145px 1fr;
            gap: 8px;
            padding: 7px 10px;
            border-top: 1px solid #e2e8f0;
          }
          .row:first-of-type {
            border-top: none;
          }
          .label {
            color: #0f766e;
            font-size: 10px;
            font-weight: 700;
          }
          .value {
            color: #1e293b;
            font-size: 10px;
            white-space: pre-wrap;
            word-break: break-word;
            line-height: 1.35;
          }
          .footer {
            margin-top: 10px;
            border-top: 1px dashed #94a3b8;
            padding-top: 8px;
            display: flex;
            justify-content: space-between;
            gap: 16px;
            font-size: 9px;
            color: #334155;
          }
        </style>
        <div class="topBand"></div>
        <div class="header">
          <div class="badge">TN</div>
          <div>
            <h1 class="heading">${escapeHtml(ui.formTitle)}</h1>
            <p class="subHeading">${escapeHtml(ui.formSubTitle)}</p>
          </div>
        </div>
        <div class="metaGrid">
          <div class="metaItem">
            <div class="metaLabel">${escapeHtml(ui.fileToken)}</div>
            <div class="metaValue">${escapeHtml(item.token ?? "")}</div>
          </div>
          <div class="metaItem">
            <div class="metaLabel">${escapeHtml(ui.fileSubmittedAt)}</div>
            <div class="metaValue">${escapeHtml(formattedDate)}</div>
          </div>
        </div>
        <div class="panel">
          <h2 class="panelTitle">${escapeHtml(ui.complaintMessage)}</h2>
          ${rowMarkup}
        </div>
        <div class="footer">
          <div>${escapeHtml(ui.fileSubmittedAt)}: ${escapeHtml(generationTime)}</div>
          <div>${escapeHtml(ui.token)}: ${escapeHtml(item.token ?? "")}</div>
        </div>
      </div>
    `;

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "12px";
    container.style.top = "12px";
    container.style.zIndex = "2147483647";
    container.style.pointerEvents = "none";
    container.style.width = "560px";
    container.style.background = "#ffffff";
    container.innerHTML = template;
    document.body.appendChild(container);

    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(container, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 18;
      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = Math.min(maxWidth / canvasWidth, maxHeight / canvasHeight);
      const renderWidth = canvasWidth * ratio;
      const renderHeight = canvasHeight * ratio;

      doc.addImage(canvas, "PNG", margin, margin, renderWidth, renderHeight, undefined, "FAST");

      const imageItems = allMediaItems.filter((media) => String(media?.dataUrl || "").startsWith("data:image/"));
      let startIndex = 0;

      if (imageItems.length > 0) {
        const firstImage = imageItems[0];
        const imageDataUrl = String(firstImage.dataUrl);
        const isPng = imageDataUrl.startsWith("data:image/png");
        const isWebp = imageDataUrl.startsWith("data:image/webp");
        const format = isPng ? "PNG" : isWebp ? "WEBP" : "JPEG";
        const inlineTop = margin + renderHeight + 8;
        const inlineSideMargin = 36;
        const inlineMaxW = pageWidth - inlineSideMargin * 2;
        const inlineMaxH = pageHeight - inlineTop - margin;

        if (inlineMaxH > 80) {
          const props = doc.getImageProperties(imageDataUrl);
          const inlineRatio = Math.min(inlineMaxW / props.width, inlineMaxH / props.height);
          const drawW = props.width * inlineRatio;
          const drawH = props.height * inlineRatio;
          const drawX = (pageWidth - drawW) / 2;
          doc.addImage(imageDataUrl, format, drawX, inlineTop, drawW, drawH, undefined, "FAST");
          startIndex = 1;
        }
      }

      imageItems.slice(startIndex).forEach((media, offset) => {
        doc.addPage();
        const index = startIndex + offset;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(`Media Attachment ${index + 1}`, 36, 40);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        const mediaName = media.name || "Image";
        const fileNameLines = doc.splitTextToSize(mediaName, doc.internal.pageSize.getWidth() - 72);
        doc.text(fileNameLines, 36, 56);

        const imageDataUrl = String(media.dataUrl);
        const isPng = imageDataUrl.startsWith("data:image/png");
        const isWebp = imageDataUrl.startsWith("data:image/webp");
        const format = isPng ? "PNG" : isWebp ? "WEBP" : "JPEG";
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();
        const imageTop = 56 + fileNameLines.length * 12 + 8;
        const imageMargin = 36;
        const maxW = pageW - imageMargin * 2;
        const maxH = pageH - imageTop - 36;
        const props = doc.getImageProperties(imageDataUrl);
        const pageRatio = Math.min(maxW / props.width, maxH / props.height);
        const drawW = props.width * pageRatio;
        const drawH = props.height * pageRatio;
        const drawX = (pageW - drawW) / 2;

        doc.addImage(imageDataUrl, format, drawX, imageTop, drawW, drawH, undefined, "FAST");
      });
      doc.save(fileName);
    } finally {
      container.remove();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-100 font-sans text-[#0f766e]">
      {/* <Navbar /> */}

      <section className="mx-auto mb-10 mt-6 w-full max-w-6xl px-3 sm:px-6">
        <div className="overflow-hidden rounded-xl border border-teal-200 bg-white shadow-xl">
          <div className="px-5 pb-6 pt-5 sm:px-8">
            <div className="mb-5">
              <h1 className="text-2xl font-bold text-[#0f766e]">{ui.formTitle}</h1>
              <p className="mt-1 text-sm text-teal-700">{ui.formSubTitle}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-sm font-semibold text-teal-800">
                    {ui.fullName}
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={ui.placeholderName}
                    className="rounded-lg border border-teal-200 px-3 py-2 text-sm outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-teal-100"
                  />
                  {errors.name && <small className="text-xs font-medium text-red-700">{errors.name}</small>}
                </div>

                <div className="flex flex-col gap-1.5" id="departments">
                  <label htmlFor="department" className="text-sm font-semibold text-teal-800">
                    {ui.department}
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="">{ui.selectDepartment}</option>
                    {departments.map((dep) => (
                      <option key={dep.id} value={dep.id}>
                        {isTamil ? decodeMojibakeTamil(dep.ta) : dep.en}
                      </option>
                    ))}
                  </select>
                  {errors.department && <small className="text-xs font-medium text-red-700">{errors.department}</small>}
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label htmlFor="constituency" className="text-sm font-semibold text-teal-800">
                    {ui.constituency}
                  </label>
                  <select
                    id="constituency"
                    name="constituency"
                    value={formData.constituency}
                    onChange={handleChange}
                    className="rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="">{ui.selectConstituency}</option>
                    {constituencies.map((item) => (
                      <option key={item.id} value={item.id}>
                        {isTamil ? decodeMojibakeTamil(item.ta) : item.en}
                      </option>
                    ))}
                  </select>
                  {errors.constituency && <small className="text-xs font-medium text-red-700">{errors.constituency}</small>}
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label htmlFor="addressLine1" className="text-sm font-semibold text-teal-800">
                    {ui.address}
                  </label>
                  <input
                    id="addressLine1"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder={ui.placeholderAddress}
                    className="rounded-lg border border-teal-200 px-3 py-2 text-sm outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-teal-100"
                  />
                  {errors.addressLine1 && <small className="text-xs font-medium text-red-700">{errors.addressLine1}</small>}
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label htmlFor="addressLine2" className="text-sm font-semibold text-teal-800">
                    {ui.pincode}
                  </label>
                  <input
                    id="addressLine2"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder={ui.placeholderPincode}
                    className="rounded-lg border border-teal-200 px-3 py-2 text-sm outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-sm font-semibold text-teal-800">
                    {ui.phoneNumber}
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={ui.placeholderPhone}
                    className="rounded-lg border border-teal-200 px-3 py-2 text-sm outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-teal-100"
                  />
                  {errors.phone && <small className="text-xs font-medium text-red-700">{errors.phone}</small>}
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2" id="help">
                  <label htmlFor="message" className="text-sm font-semibold text-teal-800">
                    {ui.complaintMessage}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={ui.placeholderMessage}
                    className="rounded-lg border border-teal-200 px-3 py-2 text-sm outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-teal-100"
                  />
                  {errors.message && <small className="text-xs font-medium text-red-700">{errors.message}</small>}
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label htmlFor="attachment" className="text-sm font-semibold text-teal-800">
                    {ui.uploadFile}
                  </label>
                  <input
                    id="attachment"
                    type="file"
                    multiple
                    onChange={handleAttachmentChange}
                    className="rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-teal-100 file:px-3 file:py-1.5 file:font-semibold file:text-[#0f766e] hover:file:bg-teal-200"
                  />
                  {formData.attachmentNames.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {formData.attachmentNames.map((name, index) => (
                        <span
                          key={`${name}-${index}`}
                          className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-3 py-1 text-xs text-teal-900"
                        >
                          {name}
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="rounded-full p-0.5 text-teal-900 hover:bg-teal-200"
                            aria-label={`Remove ${name}`}
                            title="Remove file"
                          >
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <span className="text-sm font-semibold text-teal-800">{ui.uploadFromCamera}</span>
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*,video/*"
                    capture="environment"
                    multiple
                    onChange={handleCameraCapture}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={openCamera}
                    className="inline-flex w-fit items-center gap-2 rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm font-semibold text-[#0f766e] transition hover:bg-teal-50"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h4l2-2h6l2 2h4v12H3V7z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    {ui.uploadFromCamera}
                  </button>
                  {cameraError && <small className="text-xs text-amber-700">{cameraError}</small>}
                  {formData.cameraMediaNames.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {formData.cameraMediaNames.map((name, index) => (
                        <span
                          key={`${name}-${index}`}
                          className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-3 py-1 text-xs text-teal-900"
                        >
                          {name}
                          <button
                            type="button"
                            onClick={() => removeCameraMedia(index)}
                            className="rounded-full p-0.5 text-teal-900 hover:bg-teal-200"
                            aria-label={`Remove ${name}`}
                            title="Remove file"
                          >
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  {capturedPreviewUrls.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {capturedPreviewUrls.map((url, index) => (
                        <button
                          key={`${url}-${index}`}
                          type="button"
                          onClick={() => setFullscreenPreviewUrl(url)}
                          className="rounded-md border border-teal-200"
                          title={ui.viewFullscreen}
                        >
                          <img
                            src={url}
                            alt={`Captured preview ${index + 1}`}
                            className="h-24 w-24 rounded-md object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="mt-5 w-full rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0f766e]"
              >
                {ui.submitComplaint}
              </button>
            </form>

          </div>
        </div>
      </section>

      {cameraStream && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-2xl">
            <h3 className="mb-3 text-base font-bold text-[#0f766e]">{ui.cameraPreview}</h3>
            <video ref={liveVideoRef} autoPlay playsInline muted className="h-64 w-full rounded-lg bg-black object-cover" />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleTakePhoto}
                className="rounded-lg bg-[#0f766e] px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
              >
                {ui.takePhoto}
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="rounded-lg border border-teal-200 bg-white px-4 py-2 text-sm font-semibold text-[#0f766e] hover:bg-teal-50"
              >
                {ui.closeCamera}
              </button>
            </div>
          </div>
        </div>
      )}

      {fullscreenPreviewUrl && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-black/80 p-4"
          onClick={() => setFullscreenPreviewUrl("")}
        >
          <button
            type="button"
            onClick={() => setFullscreenPreviewUrl("")}
            className="absolute right-4 top-4 rounded-md bg-white px-3 py-1 text-sm font-semibold text-[#0f766e]"
          >
            {ui.close}
          </button>
          <img
            src={fullscreenPreviewUrl}
            alt="Fullscreen camera upload"
            className="max-h-[90vh] max-w-[95vw] rounded-lg object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}

      {showSubmittedModal && currentComplaint && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-teal-200 bg-white p-6 shadow-2xl">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-teal-100 text-[#0f766e]">
              <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-center text-xl font-bold text-[#0f766e]">{ui.submittedComplaints}</h3>
            <p className="mt-2 text-center text-sm text-teal-700">
              {ui.submittedSuccess} <span className="font-bold">{token}</span>
            </p>

            <div className="mt-5 rounded-xl border border-teal-200 bg-teal-50 p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal-700">{ui.token}</div>
              <div className="text-base font-bold text-[#0f766e]">{currentComplaint.token}</div>
              <div className="mt-3 text-sm text-teal-800">{currentComplaint.name}</div>
              <div className="text-sm text-teal-800">{getDepartmentLabel(currentComplaint.department, isTamil)}</div>
              <div className="text-sm text-teal-800">
                {currentComplaint.constituency ? getConstituencyLabel(currentComplaint.constituency, isTamil) : "-"}
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSubmittedModal(false)}
                className="rounded-lg border border-teal-200 bg-white px-4 py-2 text-sm font-semibold text-[#0f766e] hover:bg-teal-50"
              >
                {ui.close}
              </button>
              <button
                type="button"
                onClick={() => handleDownload(currentComplaint)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0f766e] px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
                title={ui.downloadComplaint}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l4-4m-4 4l-4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                </svg>
                {ui.download}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* <Footer /> */}
    </main>
  );
}
