import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";
import axiosInstance from "../../api/axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(
        "/files/my-files",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFiles(response.data);
    } catch (err) {
      setError("Failed to fetch files");
    }
  };

  const handleDelete = async (fileId) => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFiles();
    } catch (err) {
      setError("Failed to delete file");
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{ mt: { xs: 4, sm: 6 }, mb: { xs: 4, sm: 6 } }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
              mb: 3,
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                color: "#15803d",
                textAlign: { xs: "left", sm: "initial" },
              }}
            >
              📁 My Files
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/upload")}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: "#16a34a",
                boxShadow: 3,
                fontSize: { xs: "0.85rem", sm: "1rem" },
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.5 },
                "&:hover": {
                  backgroundColor: "#15803d",
                  boxShadow: 6,
                },
              }}
            >
              Upload New File
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              background: "linear-gradient(to bottom right, #ffffff, #f5f7fa)",
            }}
          >
            {error && (
              <Typography color="error" gutterBottom textAlign="center">
                {error}
              </Typography>
            )}

            <List>
              {files.map((file, index) => (
                <React.Fragment key={file._id}>
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/analysis/${file._id}`)}
                          sx={{
                            textTransform: "none",
                            borderColor: "#16a34a",
                            color: "#15803d",
                            fontWeight: 500,
                            "&:hover": {
                              borderColor: "#15803d",
                              backgroundColor: "rgba(22, 163, 74, 0.08)",
                            },
                          }}
                        >
                          Analyze
                        </Button>
                        <IconButton
                          onClick={() => handleDelete(file._id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primaryTypographyProps={{
                        fontWeight: "bold",
                        color: "#15803d",
                        fontSize: { xs: "0.95rem", sm: "1rem" },
                      }}
                      primary={file.originalName}
                      secondary={`Uploaded on ${new Date(
                        file.uploadDate
                      ).toLocaleDateString()}`}
                    />
                  </ListItem>
                  {index < files.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}

              {files.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="No files uploaded yet"
                    secondary="Click the Upload New File button to get started"
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
