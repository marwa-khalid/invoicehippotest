import React from "react";

const Step2: React.FC = () => {
  return (
    <form className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Sign Up Form</h2>
      <div className="space-y-2">
        <label className="block text-gray-700">Full Name:</label>
        <input
          className="w-full border border-gray-300 p-2 rounded"
          type="text"
          name="fullName"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-gray-700">Email:</label>
        <input
          className="w-full border border-gray-300 p-2 rounded"
          type="email"
          name="email"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-gray-700">Password:</label>
        <input
          className="w-full border border-gray-300 p-2 rounded"
          type="password"
          name="password"
        />
      </div>
      <button
        className="w-full bg-blue-500 text-white py-2 rounded"
        type="submit"
      >
        Sign Up
      </button>
    </form>
  );
};

export default Step2;
