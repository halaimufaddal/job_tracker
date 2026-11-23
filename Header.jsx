import React from "react";
import "../styles/Header.css";


function Header({
  stats = {
    total: 0,
    interviewing: 0,
    offer: 0,
    rejected: 0,
  },
}) {
  return (
    <header className="top-wrapper">
      {/* Top Navbar */}
      <div className="header">
        <div className="left_side">
          <div className="logo-badge" aria-hidden="true">
            📈
          </div>
          <h5 className="header_heading">TrackHire</h5>
        </div>

        <div className="right_side">
          <div className="profile-avatar" title="User Profile">
            MH
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="charts">
        <div className="stat-card applied">
          <span className="stat-icon" aria-hidden="true">📋</span>
          <p className="stat-label">
            Total Applied: <strong>{stats.total}</strong>
          </p>
        </div>

        <div className="stat-card interviewing">
          <span className="stat-icon" aria-hidden="true">👥</span>
          <p className="stat-label">
            Interviewing: <strong>{stats.interviewing}</strong>
          </p>
        </div>

        <div className="stat-card offers">
          <span className="stat-icon" aria-hidden="true">📄</span>
          <p className="stat-label">
            Offers: <strong>{stats.offer}</strong>
          </p>
        </div>

        <div className="stat-card rejected">
          <span className="stat-icon" aria-hidden="true">✖</span>
          <p className="stat-label">
            Rejected: <strong>{stats.rejected}</strong>
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;