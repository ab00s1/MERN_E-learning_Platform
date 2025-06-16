import { useAdmin } from "../../context/AdminContext";
import { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import { motion } from "framer-motion";

const statVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15 } }),
};

const tableVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.5 + i * 0.15 } }),
};

const AdminDashboard = () => {
  const { getCompleteStatus } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ users: [], courses: [], lectures: [] });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getCompleteStatus();
        setStats({
          users: res.users || [],
          courses: res.courses || [],
          lectures: res.lectures || [],
        });
      } catch (err) {
        setError("Failed to load dashboard data.");
      }
      setLoading(false);
    };
    fetchStats();
  }, [getCompleteStatus]);

  const maxCount = Math.max(
    stats.users.length,
    stats.courses.length,
    stats.lectures.length,
    1
  );

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-2">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto bg-white/90 rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col items-center"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-6 tracking-tight text-center drop-shadow-lg">
          Admin Dashboard
        </h1>
        {loading && <Loading />}
        {error && (
          <div className="w-full bg-red-100 border border-red-300 text-red-700 rounded-md px-4 py-2 mb-4 text-center font-medium animate-pulse">
            {error}
          </div>
        )}
        {!loading && !error && (
          <>
            <div className="w-full flex flex-wrap gap-6 justify-center mb-10">
              {[
                {
                  label: "Users",
                  value: stats.users.length,
                  color: "bg-blue-600",
                  bar: "bg-blue-400",
                  icon: (
                    <svg
                      className="w-7 h-7 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-5a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ),
                },
                {
                  label: "Courses",
                  value: stats.courses.length,
                  color: "bg-green-600",
                  bar: "bg-green-400",
                  icon: (
                    <svg
                      className="w-7 h-7 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <rect
                        x="4"
                        y="4"
                        width="16"
                        height="13"
                        rx="2"
                        fill="#bbf7d0"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 10h8M8 14h5"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                      />
                    </svg>
                  ),
                },
                {
                  label: "Lectures",
                  value: stats.lectures.length,
                  color: "bg-red-600",
                  bar: "bg-red-400",
                  icon: (
                    <svg
                      className="w-7 h-7 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  ),
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={statVariants}
                  className={`flex-1 min-w-[220px] max-w-xs bg-white rounded-xl shadow-lg p-6 flex flex-col items-start gap-2 border-t-4 ${stat.color}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {stat.icon}
                    <span className="text-lg font-semibold text-gray-700">
                      {stat.label}
                    </span>
                  </div>
                  <span className="text-3xl font-extrabold text-gray-900 drop-shadow-sm">
                    {stat.value}
                  </span>
                  <div
                    className={`w-full h-3 rounded-full ${stat.bar} mt-2`}
                    style={{
                      width: `${(stat.value / maxCount) * 100}%`,
                      transition: "width 0.4s",
                    }}
                  />
                </motion.div>
              ))}
            </div>
            <div className="w-full flex flex-wrap gap-6 justify-center">
              {[
                {
                  title: "Recent Users",
                  headers: ["Name", "Email", "Role"],
                  rows: stats.users
                    .slice(-5)
                    .reverse()
                    .map((u) => [u.name, u.email, u.role]),
                  key: "users",
                },
                {
                  title: "Recent Courses",
                  headers: ["Title", "Category", "Created By"],
                  rows: stats.courses
                    .slice(-5)
                    .reverse()
                    .map((c) => [c.title, c.category, c.createdBy]),
                  key: "courses",
                },
                {
                  title: "Recent Lectures",
                  headers: ["Title", "Course"],
                  rows: stats.lectures
                    .slice(-5)
                    .reverse()
                    .map((l) => [l.title, l.course?.title || l.course]),
                  key: "lectures",
                },
              ].map((table, i) => (
                <motion.div
                  key={table.key}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={tableVariants}
                  className="flex-1 min-w-[280px] max-w-md bg-white rounded-xl shadow-lg p-5 mb-4 border border-blue-100"
                >
                  <h2 className="text-blue-700 text-lg font-bold mb-3 flex items-center gap-2">
                    {table.title}
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-1">
                      <thead>
                        <tr>
                          {table.headers.map((h) => (
                            <th
                              key={h}
                              className="bg-blue-50 text-blue-700 font-semibold px-3 py-2 rounded-t-md text-sm"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.length === 0 ? (
                          <tr>
                            <td
                              colSpan={table.headers.length}
                              className="text-center text-gray-400 py-3"
                            >
                              No data
                            </td>
                          </tr>
                        ) : (
                          table.rows.map((row, idx) => (
                            <tr
                              key={idx}
                              className="hover:bg-blue-50 transition"
                            >
                              {row.map((cell, j) => (
                                <td
                                  key={j}
                                  className="px-3 py-2 text-gray-700 text-sm"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
