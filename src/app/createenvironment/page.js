"use client";

import Navbar from "../components/navbar";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import Azure from "../../../public/azure-logo.png";

export default function Environment() {
  return (
    <div className="min-h-screen text-white">
      <Navbar />
      {/* Header */}
      <div className="mx-16 my-6">
        <h1 className="text-4xl font-bold">Create Environment</h1>
        <p className="text-lg text-gray-400 ml-1 mt-4">
          Create Environment → Todo List
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white text-black mx-16 my-8 p-8 rounded-lg shadow-lg">
        {/* Form Title */}
        <h2 className="text-2xl font-semibold mb-6">Details</h2>

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-8">
          {/* Environment Name */}
          <div>
            <label htmlFor="environmentName" className="font-medium block mb-2">
              Environment Name
            </label>
            <input
              type="text"
              id="environmentName"
              name="environmentName"
              className="border border-slate-300 rounded w-full px-4 py-2 text-base"
              defaultValue="Todo List Development"
            />
          </div>

          {/* Environment Type */}
          <div>
            <label htmlFor="environmentType" className="font-medium block mb-2">
              Environment Type
            </label>
            <select
              id="environmentType"
              name="environmentType"
              className="border border-slate-300 rounded w-full px-4 py-2 text-base"
              defaultValue="Development"
            >
              <option value="Development">Development</option>
              <option value="Production">Production</option>
              <option value="Testing">Testing</option>
            </select>
          </div>

          {/* Cloud Provider */}
          <div>
            <label htmlFor="cloudProvider" className="font-medium block mb-2">
              Cloud Provider
            </label>
            <div className="flex items-center space-x-2 ml-2">
              <Image src={Azure} width={80} height={80} alt="Azure Logo" />
            </div>
          </div>

          {/* Region */}
          <div>
            <label htmlFor="region" className="font-medium block mb-2">
              Region
            </label>
            <select
              id="region"
              name="region"
              className="border border-slate-300 rounded w-full px-4 py-2 text-base"
              defaultValue="West Europe"
            >
              <option value="West Europe">West Europe</option>
              <option value="East US">East US</option>
              <option value="Asia Pacific">Asia Pacific</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-8">
          <Link href={"/homepage"}>
            <button className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400">
              Back
            </button>
          </Link>
          <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}