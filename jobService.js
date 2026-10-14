const API_URL = "http://localhost:5001/api/jobs";

export const getJobs = async () => {
  const response = await fetch(API_URL);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch jobs.");
  }

  return data;
};