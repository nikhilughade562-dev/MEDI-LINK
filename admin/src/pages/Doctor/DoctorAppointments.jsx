import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { useNavigate } from 'react-router-dom';

const DoctorAppointments = () => {
  const navigate=useNavigate();
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);

  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh]   ">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_3fr_1fr_2fr] gap-1 py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.reverse().map((item, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_3fr_1fr_2fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
            key={index}
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full"
                src={item.userData.image}
                alt=""
              />{" "}
              <p>{item.userData.name}</p>
            </div>
            <div>
              <p className="text-xs inline border border-primary px-2 rounded-full">
                {item.payment ? "Online" : "CASH"}
              </p>
            </div>
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>
            <p>
              {currency}
              {item.amount}
            </p>
            {item.cancelled ? (
              <p className="text-red-400 text-xs font-bold">Cancelled</p>
            ) : item.isCompleted ? (
              <p className="text-green-500 text-xs font-bold">Completed</p>
            ) : (
              <div className="flex justify-end gap-3.5">
                <button  className="bg-red-700 px-2 py-1 rounded-lg text-white font-bold cursor-pointer text-xs" onClick={() => cancelAppointment(item._id)}>Cancel</button>
                  <button  className="bg-green-500 px-2 py-1 rounded-lg text-white font-bold cursor-pointer text-xs" onClick={() => completeAppointment(item._id)}>Complete</button>
                  <button className="bg-blue-700 px-2 py-1 rounded-lg text-white font-bold cursor-pointer text-xs" onClick={()=>navigate(`/prescription/${item._id}`)}>Precription</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorAppointments
