import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import MainLayout from "../../Layout/member/MainLayout";
import { FaUser, FaUserSecret, FaCalendar, FaPencilAlt, FaUserCheck, FaUserClock, FaIdCard } from "react-icons/fa";
import "../../css/backend/member/dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingMembers: 0,
    totalSessions: 0,
    totalKyc: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch members
        const membersRes = await api.get("/member/members");
        const members = membersRes?.data?.data || [];
        const totalMembers = members.length;
        const pendingMembers = members.filter((m) => m.status === 0).length;
        const approvedMembers = members.filter((m) => m.status === 1).length;

        const kycRes = await api.get("/kyc");
        const kycRecords = kycRes?.data?.data || [];
        const totalKyc = kycRecords.length;

        setStats({
          totalMembers,
          pendingMembers,
          approvedMembers,
          totalKyc,
        });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <div className="breadcrumb">Home / Dashboard</div>
      <h1 className="page-header">Member Dashboard</h1>

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

        <div className="card teal">
          <FaUserCheck className="icon" />
          <div>
            <div className="number">{stats.approvedMembers}</div>
            <div>Approved Members</div>
          </div>
        </div>

        <div className="card red">
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
