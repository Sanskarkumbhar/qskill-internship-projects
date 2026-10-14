const API_URL = "http://localhost:5001/api/applications";

export const applyForJob = async (applicationData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(applicationData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to submit application."
    );
  }

  return data;
};

export const getMyApplications = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/my-applications`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch applications."
    );
  }

  return data;
};

export const getReceivedApplications = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/received`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch received applications."
    );
  }

  return data;
};

export const updateApplicationStatus = async (
  applicationId,
  status
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/${applicationId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update application."
    );
  }

  return data;
};