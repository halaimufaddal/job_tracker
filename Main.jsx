import React, { useState, useEffect, useCallback } from "react";
import "../styles/Main.css";
import Header from "./Header";

const API_URL = "http://localhost:5300/api/routes";

function Main() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    interviewing: 0,
    offer: 0,
    rejected: 0,
  });

  // Jobs list from MongoDB
  const [jobs, setJobs] = useState([]);

  // State for editing a row
  const [editId, setEditId] = useState(null);
  const [editStatus, setEditStatus] = useState("");

  // State for adding a new application
  const [showAddForm, setShowAddForm] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [newStatus, setNewStatus] = useState("Applied");

  const fetchJobs = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search.trim()) {
        params.set("search", search.trim());
      }
      if (status) {
        params.set("status", status);
      }

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`${API_URL}/read${queryString}`);
      const data = await res.json();

      setJobs(data.jobs || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.log("Error loading jobs:", err);
    }
  }, [search, status]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  function getStatusClass(jobStatus) {
    if (jobStatus === "Interviewing") return "status_interviewing";
    if (jobStatus === "Offer") return "status_offer";
    if (jobStatus === "Rejected") return "status_rejected";
    return "status_applied";
  }

  function handleChange(e) {
    setSearch(e.target.value);
  }

  function handleStatus(e) {
    setStatus(e.target.value);
  }

  // Open/close Add Application form
  function handleClick() {
    setShowAddForm((prev) => !prev);
  }

  // Save new application to backend
  async function handleAddSubmit(e) {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    try {
      const res = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: company.trim(),
          role: role.trim(),
          status: newStatus,
        }),
      });

      if (res.ok) {
        await fetchJobs();
        setCompany("");
        setRole("");
        setNewStatus("Applied");
        setShowAddForm(false);
      }
    } catch (err) {
      console.log("Error adding job:", err);
    }
  }

  // Open edit mode for the clicked job
  function handleEditbtn(job) {
    setEditId(job._id);
    setEditStatus(job.status);
  }

  // Save edited status to backend
  async function handleSaveEdit(id) {
    try {
      const res = await fetch(`${API_URL}/update/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: editStatus }),
      });

      if (res.ok) {
        await fetchJobs();
        setEditId(null);
      }
    } catch (err) {
      console.log("Error updating job:", err);
    }
  }

  // Delete job from backend
  async function handleDeletebtn(id) {
    try {
      const res = await fetch(`${API_URL}/delete/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchJobs();
      }
    } catch (err) {
      console.log("Error deleting job:", err);
    }
  }

  return (
    <>
      <Header stats={stats} />
      <div className="main">
        <div className="search_area">
          <div className="search_bar">
            <input
              type="text"
              placeholder="Search Applications"
              value={search}
              onChange={handleChange}
            />
          </div>

          <div className="search_status">
            <select
              name="stats_sections"
              id="stats"
              value={status}
              onChange={handleStatus}
            >
              <option value="">Status</option>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="add_btn">
            <button type="button" className="btn" onClick={handleClick}>
              + ADD APPLICATIONS
            </button>
          </div>
        </div>

        {/* Add Application Form */}
        {showAddForm && (
          <form className="add_form" onSubmit={handleAddSubmit}>
            <input
              type="text"
              placeholder="Company Name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />

            <input
              type="text"
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>

            <button type="submit" className="btn">
              Save
            </button>

            <button
              type="button"
              className="cancel_btn"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
          </form>
        )}

        <div className="jobs_table_container">
          <table className="jobs_table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Status</th>
                <th>Applied Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td className="company_cell">
                    <span className="company_logo amazon">
                      {job.companyName?.charAt(0).toUpperCase()}
                    </span>
                    <span className="company_name">{job.companyName}</span>
                  </td>
                  <td className="role_cell">{job.role}</td>
                  <td className="status_cell">
                    {editId === job._id ? (
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    ) : (
                      <span className={`status_badge ${getStatusClass(job.status)}`}>
                        {job.status}
                      </span>
                    )}
                  </td>
                  <td className="date_cell">
                    {job.createdAt
                      ? new Date(job.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })
                      : ""}
                  </td>
                  <td className="actions_cell">
                    {editId === job._id ? (
                      <button
                        type="button"
                        className="action_btn"
                        aria-label="Save"
                        onClick={() => handleSaveEdit(job._id)}
                      >
                        ✔
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="action_btn edit_btn"
                        aria-label="Edit"
                        onClick={() => handleEditbtn(job)}
                      >
                        ✏️
                      </button>
                    )}
                    <button
                      type="button"
                      className="action_btn delete_btn"
                      aria-label="Delete"
                      onClick={() => handleDeletebtn(job._id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Main;