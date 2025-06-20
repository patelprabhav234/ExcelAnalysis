import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
} from "@mui/material";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFiles: 0,
    totalAnalyses: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users");
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (err) {
      setError("Failed to fetch statistics");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to delete user";
      setError(errorMsg);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }} className="animate-fadeIn">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" className="text-green-700 text-center font-bold">
            Admin Dashboard
          </Typography>
        </Grid>

        {/* Statistics Cards */}
        {[
          { title: "Total Users", value: stats.totalUsers },
          { title: "Total Files", value: stats.totalFiles },
          { title: "Total Analyses", value: stats.totalAnalyses },
        ].map((card, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 3,
                background: "linear-gradient(to right, #f9fafb, #eef2f7)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
              }}
              className="hover:shadow-xl transition-shadow duration-300"
            >
              <Typography variant="h6" className="text-green-700">
                {card.title}
              </Typography>
              <Typography variant="h3" className="text-green-700 font-semibold mt-2">
                {card.value}
              </Typography>
            </Paper>
          </Grid>
        ))}

        {/* Users Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom className="text-green-700 font-medium text-center pb-2 ">
              User Management
            </Typography>
            {error && (
              <Typography color="error" gutterBottom>
                {error}
              </Typography>
            )}
            <TableContainer className="rounded-lg shadow-md">
              <Table>
                <TableHead className="bg-gray-100">
                  <TableRow>
                    <TableCell><strong>Email</strong></TableCell>
                    <TableCell><strong>Role</strong></TableCell>
                    <TableCell><strong>Created At</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow
                      key={user._id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={user.role === "admin"}
                          className="hover:scale-105 transition-transform duration-200"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
