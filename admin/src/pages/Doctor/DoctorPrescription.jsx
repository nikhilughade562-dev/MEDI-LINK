import React, { useRef, useState,useContext, useEffect } from "react";
import PrescriptionForm from "./PrescriptionForm";
import PrescriptionPDF from "./PrescriptionPDF";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useParams } from "react-router-dom";
import axios from "axios"
import { DoctorContext } from "../../context/DoctorContext";

const DoctorPrescription = () => {

  const {appointmentId}=useParams();
  const [showPreview, setShowPreview] = useState(false);
  const pdfRef = useRef(null);
  const {backendUrl, dToken,appointments} = useContext(DoctorContext);
  const [upload,setupload]=useState(false);
  const [appointment,setappointment]=useState();

  const getTodayDate = () => {
  const today = new Date();
    return today.toISOString().split("T")[0]; // Returns "2026-06-20"
  };
 
    useEffect(() => {
      const fetchAppointment = appointments.find(
        (item) => item._id === appointmentId); 
    if(fetchAppointment){
      setFormData((prev) => ({
        ...prev,
        patientName: fetchAppointment.userData?.name || "",
        doctorName:fetchAppointment.docData.name,
        doctorQualification:fetchAppointment.docData.speciality,
        doctorSpeciality:fetchAppointment.docData.degree
      }));
      setappointment(fetchAppointment);
    }
    
    }, [appointmentId,appointments])
    
  

  const [formData, setFormData] = useState({
    patientName: "",
    age: "34",
    gender: "Male",
    date: getTodayDate(),

    diagnosis:"",

    medicines: [],


    investigations: [],

    advice: "",

    doctorName:"",
    doctorQualification:"",
    doctorSpeciality:""
  });

  const handleFormClear = () => {
    setFormData((prev) => ({
      ...prev,

      diagnosis: "",
      diagnosisType: "",

      medicineSearch: "",
      medicines: [],

      testSearch: "",
      investigations: [],

      advice: "",
    }));
  };

  const generatePdf = async (download=false) => {
    const element = pdfRef.current;

    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.6);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Scale the image down if it's taller than an A4 page
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);

  heightLeft -= pageHeight;

  // Remaining pages
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;

    pdf.addPage();

    pdf.addImage(
      imgData,
      "JPEG",
      0,
      position,
      imgWidth,
      imgHeight
    );

    heightLeft -= pageHeight;
  }
    if (download) {
      pdf.save("prescription.pdf");
      return;
    }

    return pdf;
  };

  const handlePdfDownload = async () => {
    await generatePdf(true);
  };

  const uploadPrescription=async ()=>{
      try {
    const pdf = await generatePdf();

    const blob = pdf.output("blob");

    const file = new File([blob], "prescription.pdf", {
      type: "application/pdf",
    });

    const fileData = new FormData();

    fileData.append("prescription", file);
    fileData.append("appointmentId", appointmentId);

    const { data } = await axios.post(
       backendUrl +"/api/doctor/upload-prescription",
      fileData,
      {
        headers: {
          dtoken: dToken,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if(data){
      setupload(true);

    }
  } catch (err) {
    console.error(err);
  }
  }

  return (
    <>
      <PrescriptionForm
        formData={formData}
        setFormData={setFormData}
        uploadPrescription={uploadPrescription}
        handleFormClear={handleFormClear}
        upload={upload}
        openPreview={() => setShowPreview(true)}
      />

      {/* Hidden printable component */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
        }}
      >
        <div ref={pdfRef}>
          <PrescriptionPDF formData={formData} />
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white w-[90%] h-[90%] rounded-lg shadow-lg flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-bold">Prescription Preview</h2>

              <button
                onClick={() => setShowPreview(false)}
                className="text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto bg-gray-100 p-6">
              <PrescriptionPDF formData={formData} />
            </div>

            {/* Footer */}
            <div className="border-t p-4 flex justify-end gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="border px-4 py-2 rounded"
              >
                Close
              </button>

              <button
                onClick={handlePdfDownload}
                className="bg-blue-600 text-white px-5 py-2 rounded"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorPrescription;
