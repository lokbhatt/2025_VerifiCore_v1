import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { 
  FaUser, 
  FaUserClock, 
  FaUserCheck, 
  FaRegCalendarAlt, 
  FaPencilAlt, 
  FaIdCard
} from "react-icons/fa";
import "../../css/backend/admin/dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingMembers: 0,
    approvedMembers: 0,
    totalSessions: 0,
    totalKyc: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard-stats");
        setStats(res.data);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <div className="breadcrumb">Home / Dashboard</div>
      <h1 className="page-header">Admin Dashboard</h1>

      <section className="stats-grid">
        <div className="card blue">
          <FaUser className="icon" />
          <div>
            <div className="number">{stats.totalMembers}</div>
            <div>Total Members</div>
          </div>
        </div>

        <div className="card orange">
          <FaUserClock className="icon" />
          <div>
            <div className="number">{stats.pendingMembers}</div>
            <div>Pending Members</div>
          </div>
        </div>

        <div className="card red">
          <FaUserCheck className="icon" />
          <div>
            <div className="number">{stats.approvedMembers}</div>
            <div>Approved Members</div>
          </div>
        </div>

        <div className="card teal">
          <FaRegCalendarAlt className="icon" />
          <div>
            <div className="number">{stats.totalSessions}</div>
            <div>Total Sessions</div>
          </div>
        </div>

        <div className="card purple">
          <FaIdCard className="icon" />
          <div>
            <div className="number">{stats.totalKyc}</div>
            <div>Total KYC</div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
