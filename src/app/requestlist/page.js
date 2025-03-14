"use client"

import React, { useEffect, useState } from "react";
import unfilter from "../../../public/filter-circle.svg";
import filter from "../../../public/filter-circle-fill.svg";
import Image from "next/image";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { Typography } from "@material-tailwind/react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function RequestList() {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.role;
  if (userRole !== "pm" && userRole !== "ops") {
    redirect("/"); // Or you can return a message like "Access Denied"
  }
  const router = useRouter();
  // const TABLE_HEAD_REQ = ["ID", "Title", "Describe", "Last Update", "Status"];
  const TABLE_HEAD_REQ = ["Project ID", "Project Name","Request", "Type", "Status PM", "Status Ops"];
  const [TABLE_ROWS_REQ, setTableRowsReq] = useState([]);
  const [sortAsc, setSortAsc] = useState(true);

  // useEffect(() => {
  //   // Fetch request data from the API
  //   const fetchRequests = async () => {
  //     try {
  //       const res = await fetch("/api/request", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       if (res.ok) {
  //         const data = await res.json();
  //         console.log("data", data)
  //         const rows = data.map((element) => ({
  //           id: element.requestid,
  //           projectid: element.projectid,
  //           requestname: element.name,
  //           type: element.type,
  //           statuspm: element.statuspm,
  //           statusops: element.statusops,
  //         }));
  //         console.log("rows", rows)
  //         setTableRowsReq(rows);
  //       }
  //     } catch (error) {
  //       console.log("Failed to send request:", error.message);
  //     }
  //   };
  //   fetchRequests();
  // }, []);

  useEffect(() => {
    // Fetch request data from the API
    const fetchRequests = async () => {
      try {
        // First, fetch all requests
        const resRequests = await fetch("/api/request", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!resRequests.ok) {
          throw new Error("Failed to fetch requests");
        }
  
        const requestsData = await resRequests.json();
        
        // Then, fetch all projects
        const resProjects = await fetch("/api/project", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!resProjects.ok) {
          throw new Error("Failed to fetch projects");
        }
  
        const projectsData = await resProjects.json();
        
        // Create a map of project IDs to project names for quick lookup
        const projectMap = {};
        projectsData.forEach(project => {
          projectMap[project._id] = project.projectName;
        });
  
        // Now map request data and include project names
        const rows = requestsData.map((element) => ({
          id: element.requestid,
          projectid: element.projectid,
          projectname: projectMap[element.projectid] || "Unknown Project", // Add project name
          requestname: element.name,
          type: element.type,
          statuspm: element.statuspm,
          statusops: element.statusops,
        }));
  
        console.log("Requests with project names:", rows);
        setTableRowsReq(rows);
      } catch (error) {
        console.error("Failed to fetch data:", error.message);
      }
    };
    fetchRequests();
  }, []);


  const sortOrder = ["Request", "Under Review", "Rejected", "Approved"];

  // Sorting function
  const sortRows = (rows, sortAsc) => {
    return [...rows].sort((a, b) => {
      const orderA = sortOrder.indexOf(a.statuspm);
      const orderB = sortOrder.indexOf(b.statuspm);

      return sortAsc ? orderA - orderB : orderB - orderA;
    });
  };

  const toggleSortOrder = () => {
    setSortAsc((prev) => !prev);
  };

  const sortedRows = sortRows(TABLE_ROWS_REQ, sortAsc);

  return (
    <div>
      <p className="text-5xl font-bold mx-16 my-5">Requests</p>

      {/* Details box */}
      <div className="overflow-hidden bg-white mx-16 my-8 text-black text-x1 font-normal rounded-lg h-dvh">
        <table className="table-fixed w-full">
          <thead>
            <tr>
              {TABLE_HEAD_REQ.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-gray-100 p-4 text-black font-semibold"
                >
                  <Typography
                    variant="small"
                    className="font-medium text-sm leading-none opacity-70 flex flex-row items-center"
                    onClick={["Status PM", "Status Ops"].includes(head) ? toggleSortOrder : undefined}
                  >
                    {["Status PM", "Status Ops"].includes(head) && (
                      <span className="mr-2">
                        <Image
                          src={sortAsc ? filter : unfilter}
                          alt="filter"
                          height="20"
                          width="20"
                        />
                      </span>
                    )}
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>

            {userRole === 'pm' &&
              sortedRows.map(({ id, projectid, projectname,requestname, type, statuspm, statusops }, index) => {
                const isOdd = index % 2 === 1;
                const rowBgColor = isOdd ? "bg-gray-50" : "bg-white";

                return (
                  <tr key={id} className={`${rowBgColor} cursor-pointer`}>
                    <td className="p-4 border-b border-blue-gray-50">
                      {/* <Link href={`/projectpm/${projectid}`}> */}
                      <Link href={{ pathname: "/projectpm", query: { projectid } }}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {projectid}
                        </Typography>
                      </Link>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Link href={{ pathname: "/projectpm", query: { projectid } }}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {projectname}
                        </Typography>
                      </Link>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Link href={{ pathname: "/projectpm", query: { projectid } }}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {requestname}
                        </Typography>
                      </Link>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Link href={{ pathname: "/projectpm", query: { projectid } }}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {type}
                        </Typography>
                      </Link>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Link href={{ pathname: "/projectpm", query: { projectid } }}>
                        <Typography
                          variant="small"
                          className={`font-normal px-2 py-1 rounded-md 
                          ${statuspm === "Approved"
                              ? "text-green-600 bg-green-100 px-2"
                              : statuspm === "Under Review"
                                ? "text-amber-600 bg-amber-100"
                                : statuspm === "Request"
                                  ? "text-gray-600 bg-gray-100"
                                  : "text-red-600 bg-red-100"
                            }`}
                        >
                          {statuspm}
                        </Typography>
                      </Link>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Link href={{ pathname: "/projectpm", query: { projectid } }}>
                        <Typography
                          variant="small"
                          className={`font-normal px-2 py-1 rounded-md 
                          ${statusops === "Approved"
                              ? "text-green-600 bg-green-100 px-2"
                              : statusops === "Under Review"
                                ? "text-amber-600 bg-amber-100"
                                : statusops === "Request"
                                  ? "text-gray-600 bg-gray-100"
                                  : "text-red-600 bg-red-100"
                            }`}
                        >
                          {statusops}
                        </Typography>
                      </Link>
                    </td>
                  </tr>
                );
              })}

            {userRole === 'ops' &&
              sortedRows.map(({ id, projectid, projectname, requestname, type, statuspm, statusops }, index) => {
                const isOdd = index % 2 === 1;
                const rowBgColor = isOdd ? "bg-gray-50" : "bg-white";

                return (
                  <tr key={id} className={`${rowBgColor} cursor-pointer`}>
                    <td className="p-4 border-b border-blue-gray-50">
                      {/* <Link href={`/projectpm/${projectid}`}> */}
                      <Link href={{ pathname: "/projectops", query: { projectid } }}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {projectid}
                        </Typography>
                      </Link>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Link href={{ pathname: "/projectops", query: { projectid } }}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {projectname}
                        </Typography>
                      </Link>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Link href={{ pathname: "/projectops", query: { projectid } }}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {requestname}
                        </Typography>
                      </Link>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Link href={{ pathname: "/projectops", query: { projectid } }}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {type}
                        </Typography>
                      </Link>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Link href={{ pathname: "/projectops", query: { projectid } }}>
                        <Typography
                          variant="small"
                          className={`font-normal px-2 py-1 rounded-md 
                          ${statuspm === "Approved"
                              ? "text-green-600 bg-green-100 px-2"
                              : statuspm === "Under Review"
                                ? "text-amber-600 bg-amber-100"
                                : statuspm === "Request"
                                  ? "text-gray-600 bg-gray-100"
                                  : "text-red-600 bg-red-100"
                            }`}
                        >
                          {statuspm}
                        </Typography>
                      </Link>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Link href={{ pathname: "/projectops", query: { projectid } }}>
                        <Typography
                          variant="small"
                          className={`font-normal px-2 py-1 rounded-md 
                          ${statusops === "Approved"
                              ? "text-green-600 bg-green-100 px-2"
                              : statusops === "Under Review"
                                ? "text-amber-600 bg-amber-100"
                                : statusops === "Request"
                                  ? "text-gray-600 bg-gray-100"
                                  : "text-red-600 bg-red-100"
                            }`}
                        >
                          {statusops}
                        </Typography>
                      </Link>
                    </td>
                  </tr>
                );
              })}

          </tbody>
        </table>
      </div>
    </div>
  );
}
