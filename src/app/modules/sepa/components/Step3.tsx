import React from "react";

const Step3: React.FC = () => {
  return (
    <form className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Profile Form</h2>
      <div className="space-y-2">
        <label className="block text-gray-700">Address:</label>
        <input
          className="w-full border border-gray-300 p-2 rounded"
          type="text"
          name="address"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-gray-700">Phone Number:</label>
        <input
          className="w-full border border-gray-300 p-2 rounded"
          type="text"
          name="phoneNumber"
        />
      </div>
      <button
        className="w-full bg-blue-500 text-white py-2 rounded"
        type="submit"
      >
        Update Profile
      </button>
    </form>
  );
};

export default Step3;
