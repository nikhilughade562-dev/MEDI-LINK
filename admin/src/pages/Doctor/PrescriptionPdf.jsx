import React from "react";

const PrescriptionPDF = ({ formData }) => {
  return (
    <div
      className="bg-white text-black p-10 w-[794px] mx-auto"
      style={{
        minHeight: "1123px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* ================= HEADER ================= */}

      <div className="border-b-2 border-gray-400 pb-6">
        <h1 className="text-3xl text-green-600 font-bold text-center">
          MEDILINK
        </h1>

        <p className="text-center mt-2">
          Dr. John Smith
        </p>

        <p className="text-center">
          MBBS, MD (General Medicine)
        </p>

      </div>

      {/* ================= PATIENT DETAILS ================= */}

      <div className="mt-8">
        <h2 className="text-xl font-bold border-b mb-4">
          Patient Details
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>Name :</strong> {formData.patientName}
          </p>

          <p>
            <strong>Age :</strong> {formData.age}
          </p>

          <p>
            <strong>Gender :</strong> {formData.gender}
          </p>

          <p>
            <strong>Date :</strong> {formData.date}
          </p>

        </div>
      </div>

      {/* ================= DIAGNOSIS ================= */}

      <div className="mt-10">
        <h2 className="text-xl font-bold border-b mb-3">
          Diagnosis
        </h2>

        <p className="leading-7">
          {formData.diagnosis}
        </p>

      </div>

      {/* ================= MEDICINES ================= */}

      <div className="mt-10">
        <h2 className="text-xl font-bold border-b mb-4">
          Medicines
        </h2>

        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">
                Medicine
              </th>

              <th className="border p-2">
                Dosage
              </th>

              <th className="border p-2">
                Frequency
              </th>

              <th className="border p-2">
                Duration
              </th>

              <th className="border p-2">
                Advice
              </th>
            </tr>
          </thead>

          <tbody>
            {formData.medicines.map(
              (medicine, index) => (
                <tr key={index}>
                  <td className="border p-2">
                    {medicine.medicine}
                  </td>

                  <td className="border p-2">
                    {medicine.dosage}
                  </td>

                  <td className="border p-2">
                    {medicine.frequency}
                  </td>

                  <td className="border p-2">
                    {medicine.duration}
                  </td>

                  <td className="border p-2">
                    {medicine.advice}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* ================= INVESTIGATIONS ================= */}

      <div className="mt-10">
        <h2 className="text-xl font-bold border-b mb-4">
          Investigations
        </h2>

        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">
                Test
              </th>

              <th className="border p-2">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {formData.investigations.map(
              (test, index) => (
                <tr key={index}>
                  <td className="border p-2">
                    {test.testName}
                  </td>

                  <td className="border p-2">
                    {test.status}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* ================= ADVICE ================= */}

      <div className="mt-10">
        <h2 className="text-xl font-bold border-b mb-4">
          Advice
        </h2>

        <div className="whitespace-pre-line leading-7">
          {formData.advice}
        </div>
      </div>

      {/* ================= VERIFICATION ================= */}

      <div className="mt-5">
            <h2 className="font-semibold text-lg mb-4">
             Digital Verification
            </h2>

            <div className="border border-green-200 bg-green-50 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                  ✓
                </div>

                <div>
                  <h3 className="font-semibold text-green-700">
                    Electronically Verified
                  </h3>

                  <p className="text-sm text-gray-600">
                    This prescription has been digitally verified.
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <p>
                  <span className="font-medium">Doctor:</span> Dr. John Smith
                </p>

                <p>
                  <span className="font-medium">Qualification:</span> MBBS, MD
                  (General Medicine)
                </p>

                <p>
                  <span className="font-medium">Verified On:</span>{" "}
                  {formData.date}
                </p>

                <p className="text-gray-500 pt-2">
                  This prescription was generated and electronically verified
                  using{" "}
                  <span className="font-semibold text-blue-600">MediLink</span>.
                </p>

                <p className="text-gray-500">
                  No handwritten signature is required.
                </p>
              </div>
            </div>
          </div>
    </div>
  );
};

export default PrescriptionPDF;