import React from "react";

const Step1: React.FC = () => {
  return (
    <form className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Login Form</h2>
      <div className="space-y-2">
        <label className="block text-gray-700">Username:</label>
        <input
          className="w-full border border-gray-300 p-2 rounded"
          type="text"
          name="username"
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
        Login
      </button>
    </form>
  );
};

export default Step1;
