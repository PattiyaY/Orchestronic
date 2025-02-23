"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import gitlab from "../../../public/gitlab-logo-500.svg";

export default function CreateProject() {
  const { user } = useUser();
  const [projectList, setProjectList] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [branch, setBranch] = useState("");
  const [rootPath, setRootPath] = useState("");

  useEffect(() => {
    if (!user) return;

    if (!user.externalAccounts || user.externalAccounts.length === 0) {
      console.log("No external accounts found.");
      return;
    }

    const gitlabAccount = user.externalAccounts.find(
      (account) => account.provider === "gitlab"
    );

    if (!gitlabAccount) {
      console.log("No GitLab account linked.");
      return;
    }

    const gitlabToken = user.externalAccounts?.[0]?.providerUserId;

    if (!gitlabToken) {
      console.log("GitLab token is missing.");
      return;
    }

    const fetchProjects = async () => {
      try {
        const res = await fetch(
          `https://gitlab.com/api/v4/users/${gitlabToken}/projects`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch projects: ${res.statusText}`);
        }

        const projects = await res.json();
        setProjectList(projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [user]);

  if (!user) {
    return <div>Sign in to view this page</div>;
  }

  const handleProjectChange = (e) => {
    const selectedRepo = e.target.value;
    if (!selectedRepo) {
      setProjectName("");
      setProjectDescription("");
      setBranch("");
      setRootPath("");
      return;
    }

    const project = projectList.find(
      (project) => project.path_with_namespace === selectedRepo
    );

    if (project) {
      setProjectName(project.name || "");
      setProjectDescription(project.description || "");
      setBranch(project.default_branch || "");
      setRootPath(project.http_url_to_repo || "");
    }
  };

  return (
    <>
      <h1 className="mx-16 my-10 text-4xl font-bold dark:text-white">
        Create a New Project
      </h1>

      <section className="mx-16 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold capitalize text-gray-700 dark:text-white">
          General Information
        </h2>

        <form className="space-y-8">
          {/* Git Repository Section */}
          <div>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex flex-col items-left space-x-4">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Git Repository
                </label>
                <div className="inline-flex justify-left items-center">
                  <Image
                    src={gitlab}
                    width="60"
                    height="60"
                    alt="GitLab logo"
                  />
                  <span className="text-black">GitLab</span>
                </div>
              </div>

              {/* Repository Selection */}
              <div>
                <label
                  htmlFor="repository"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Select Repository
                </label>
                <select
                  id="repository"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-400 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  onChange={handleProjectChange}
                >
                  <option value="">Please select</option>
                  {projectList.map((project) => (
                    <option
                      key={project.id}
                      value={project.path_with_namespace}
                    >
                      {project.path_with_namespace}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Branch and Root Application Path Section */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="branch"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Default Branch
              </label>
              <input
                id="branch"
                type="text"
                value={branch}
                readOnly
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-400 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>

            <div>
              <label
                htmlFor="rootPath"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Root Application Path
              </label>
              <input
                id="rootPath"
                type="text"
                value={rootPath}
                readOnly
                className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-400 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>
          </div>

          {/* Application Details Section */}
          <div>
            <label
              htmlFor="applicationName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Application Name
            </label>
            <input
              id="applicationName"
              type="text"
              value={projectName}
              readOnly
              className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-400 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Description
            </label>
            <textarea
              id="description"
              value={projectDescription}
              readOnly
              className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-400 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              rows="4"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="rounded-md bg-gray-200 px-7 py-2 text-sm font-medium text-black transition hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-200 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-green-500 px-8 py-2 text-sm font-medium text-white transition hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-400"
            >
              Save
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
