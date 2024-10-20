import React from "react";
import homeImage from "./Assets/home.png"; // Importing the image

function Homepage() {
  return (
    <div>
      <div className="flex flex-col-reverse lg:flex-row items-center gap-10 justify-between px-8 py-16 lg:px-32 bg-gray-50 min-h-screen">
        <div className="flex flex-col space-y-6 lg:w-1/2">
          <h1 className="text-2xl font-bold text-black">
            Grow Your Wealth, Secure Your Future
          </h1>
          <p className="text-gray-600 text-xs">
            <strong>Why Choose Us?</strong>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Daily Updates: Get real-time updates on your investments.</li>
              <li>Secure and Reliable: Your data is encrypted and protected.</li>
              <li>Easy to Use: Manage your investments with just a few clicks.</li>
              <li>Transparent: Clear breakdowns of your investment progress and profits.</li>
            </ul>
          </p>
          <div className="flex flex-col gap-2">
          <button className="px-4 py-2 bg-gray-800 text-white rounded-m rounded-xl transition w-fit text-sm">
            Join Us Today!
          </button>
          <div className="text-md font-bold text-gray-800">
            Start Tracking Your Investments Now!
          </div>
          </div>
        </div>
        <div className="lg:w-1/2">
          <img src={homeImage} alt="Grow Wealth" className="w-96 h-auto" />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
