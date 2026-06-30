import React from "react";

const PrescriptionForm = ({
  formData,
  setFormData,
  uploadPrescription,
  openPreview,
  handleFormClear,
  upload
}) => {
  const addMedicine = () => {
  setFormData((prev) => ({
    ...prev,
    medicines: [
      ...prev.medicines,
      {
        medicine: "Crocin 650mg Tab",
        dosage: "250mg",
        frequency: "Once Daily (OD)",
        duration: "3 Days",
        advice: "After Food",
      },
    ],
  }));
};

  const deleteMedicine = (index) => {
  setFormData((prev) => ({
    ...prev,
    medicines: prev.medicines.filter((_, i) => i !== index),
  }));
};

  const addInvestigation = () => {
  setFormData((prev) => ({
    ...prev,
    investigations: [
      ...prev.investigations,
      {
        testName: "Complete Blood Count",
        status: "Pending",
      },
    ],
  }));
};
  
  const deleteInvestigation = (index) => {
  setFormData((prev) => ({
    ...prev,
    investigations: prev.investigations.filter((_, i) => i !== index),
  }));
};


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow border">
        {/* Header */}

        <div className="border-b p-5">
          <h1 className="text-2xl font-bold">
            Digital Prescription Form
          </h1>
        </div>

        <div className="p-6 space-y-6">
          {/* ================= PATIENT DETAILS ================= */}

          <div className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Patient Details</h2>

              <div className="flex items-center gap-2">
                <label className="font-medium">Date:</label>

                <input
                  type="date"
                  className="border rounded px-3 py-2"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium">Patient</label>

                <input
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={formData.patientName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      patientName: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Age</label>

                <input
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      age: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Gender</label>

                <select
                  className="w-full border rounded px-3 py-2 mt-1"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gender: e.target.value,
                    })
                  }
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* ================= DIAGNOSIS ================= */}

          <div className="border rounded-md p-4">
            <h2 className="font-semibold text-lg mb-4">
              1. Diagnosis (Text Area)
            </h2>

            <textarea
              rows={5}
              className="w-full border rounded p-3"
              value={formData.diagnosis}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  diagnosis: e.target.value,
                })
              }
            />
          </div>

          {/* ================= MEDICATIONS ================= */}
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">2. Medications</h2>

              <button
                onClick={addMedicine}
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                + Add Medicine
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left">Medicine</th>

                    <th className="border p-2 text-left">Dosage</th>

                    <th className="border p-2 text-left">Frequency</th>

                    <th className="border p-2 text-left">Duration</th>

                    <th className="border p-2 text-left">Advice</th>

                    <th className="border p-2 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {formData.medicines.map((medicine, index) => (
                    <tr key={index}>
                      <td className="border p-2">
                        <select
                          className="w-full border rounded px-2 py-2"
                          value={medicine.medicine}
                          onChange={(e) => {
                            const updated = [...formData.medicines];
                            updated[index].medicine = e.target.value;

                            setFormData({
                              ...formData,
                              medicines: updated,
                            });
                          }}
                        >
                          <option>Crocin 650mg Tab</option>
                          <option>Paracetamol 500mg Tab</option>
                          <option>Azithromycin 500mg</option>
                          <option>Amoxicillin 500mg</option>
                          <option>Cetirizine 10mg</option>
                        </select>
                      </td>

                      <td className="border p-2">
                        <select
                          className="w-full border rounded px-2 py-2"
                          value={medicine.dosage}
                          onChange={(e) => {
                            const updated = [...formData.medicines];
                            updated[index].dosage = e.target.value;

                            setFormData({
                              ...formData,
                              medicines: updated,
                            });
                          }}
                        >
                          <option>250mg</option>
                          <option>500mg</option>
                          <option>650mg</option>
                          <option>1 Tablet</option>
                          <option>2 Tablets</option>
                        </select>
                      </td>

                      <td className="border p-2">
                        <select
                          className="w-full border rounded px-2 py-2"
                          value={medicine.frequency}
                          onChange={(e) => {
                            const updated = [...formData.medicines];
                            updated[index].frequency = e.target.value;

                            setFormData({
                              ...formData,
                              medicines: updated,
                            });
                          }}
                        >
                          <option>Once Daily (OD)</option>
                          <option>Twice Daily (BD)</option>
                          <option>3 Times Daily (TID)</option>
                          <option>4 Times Daily</option>
                        </select>
                      </td>

                      <td className="border p-2">
                        <select
                          className="w-full border rounded px-2 py-2"
                          value={medicine.duration}
                          onChange={(e) => {
                            const updated = [...formData.medicines];
                            updated[index].duration = e.target.value;

                            setFormData({
                              ...formData,
                              medicines: updated,
                            });
                          }}
                        >
                          <option>3 Days</option>
                          <option>5 Days</option>
                          <option>7 Days</option>
                          <option>10 Days</option>
                          <option>15 Days</option>
                        </select>
                      </td>

                      <td className="border p-2">
                        <select
                          className="w-full border rounded px-2 py-2"
                          value={medicine.advice}
                          onChange={(e) => {
                            const updated = [...formData.medicines];
                            updated[index].advice = e.target.value;

                            setFormData({
                              ...formData,
                              medicines: updated,
                            });
                          }}
                        >
                          <option>After Food</option>
                          <option>Before Food</option>
                        </select>
                      </td>

                      <td className="border p-2">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => deleteMedicine(index)}
                            type="button"
                            className="px-3 py-1 bg-red-500 text-white rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ================= INVESTIGATIONS ================= */}
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">3. Investigations</h2>

              <button
                onClick={addInvestigation}
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                + Add Investigation
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left">Test</th>

                    <th className="border p-2 text-left">Status</th>

                    <th className="border p-2 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {formData.investigations.map((test, index) => (
                    <tr key={index}>
                      <td className="border p-2">
                        <select
                          className="w-full border rounded px-2 py-2"
                          value={test.testName}
                          onChange={(e) => {
                            const updated = [...formData.investigations];
                            updated[index].testName = e.target.value;

                            setFormData({
                              ...formData,
                              investigations: updated,
                            });
                          }}
                        >
                          <option>Complete Blood Count (CBC)</option>
                          <option>Blood Sugar</option>
                          <option>Urine Routine</option>
                          <option>X-Ray Chest</option>
                          <option>ECG</option>
                        </select>
                      </td>

                      <td className="border p-2">
                        <select
                          className="w-full border rounded px-2 py-2"
                          value={test.status}
                          onChange={(e) => {
                            const updated = [...formData.investigations];
                            updated[index].status = e.target.value;

                            setFormData({
                              ...formData,
                              investigations: updated,
                            });
                          }}
                        >
                          <option>Pending</option>
                          <option>Urgent</option>
                          <option>Completed</option>
                        </select>
                      </td>

                      <td className="border p-2">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => deleteInvestigation(index)}
                            type="button"
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ================= ADVICE ================= */}

          <div className="border rounded-md p-4">
            <h2 className="font-semibold text-lg mb-4">
              4. Advice & Lifestyle Recommendations
            </h2>

            <textarea
              rows={6}
              className="w-full border rounded p-3"
              value={formData.advice}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  advice: e.target.value,
                })
              }
            />
          </div>

          {/* ================= DIGITAL VERIFICATION ================= */}

          <div className="border rounded-md p-4">
            <h2 className="font-semibold text-lg mb-4">
              5. Digital Verification
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
                  <span className="font-medium">Doctor:</span> {formData.doctorName}
                </p>

                <p>
                  <span className="font-medium">Qualification:</span>{formData.doctorSpeciality} ({formData.doctorQualification})
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

          {/* ================= FOOTER ================= */}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleFormClear}
              type="button"
              className="border border-gray-400 px-5 py-2 rounded hover:bg-gray-100"
            >
              Clear
            </button>

            { upload ? 
              <p className="border bg-green-300 border-gray-400 px-5 py-2 rounded">Uploaded</p>
              :<button
                onClick={uploadPrescription} 
                type="button"
                className="border border-gray-400 px-5 py-2 rounded hover:bg-gray-100"
              >
                Upload
              </button>

            }
            

            <button
              onClick={openPreview}
              type="button"
              className="border border-blue-600 text-blue-600 px-5 py-2 rounded hover:bg-blue-50"
            >
              Preview
            </button>

          </div>
        </div>
      </div>
    </div>
      
  );
};

export default PrescriptionForm;