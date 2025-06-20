import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Fade,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import axiosInstance from "../../api/axios";

const FileUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const isExcel =
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "application/vnd.ms-excel";

      if (isExcel) {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Please upload an Excel file (.xlsx or .xls)");
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      await axiosInstance.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 6 }}>
        <Paper
          elevation={4}
          sx={{
            p: 5,
            borderRadius: 3,
            boxShadow: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            background: "linear-gradient(to bottom right, #ffffff, #f5f7fa)",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={600}
            gutterBottom
            align="center"
            sx={{ color: "#15803d" }}
          >
            Upload Excel File
          </Typography>

          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}

          <input
            accept=".xlsx,.xls"
            style={{ display: "none" }}
            id="file-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                px: 3,
                py: 1,
                borderColor: "#16a34a",
                color: "#15803d",
                "&:hover": {
                  backgroundColor: "rgba(22, 163, 74, 0.08)",
                  borderColor: "#15803d",
                },
              }}
            >
              Select File
            </Button>
          </label>

          <Fade in={!!file}>
            <Typography variant="subtitle1" color="text.secondary">
              {file?.name}
            </Typography>
          </Fade>

          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!file || uploading}
            sx={{
              mt: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 4,
              py: 1,
              backgroundColor: "#16a34a",
              "&:hover": {
                backgroundColor: "#15803d",
              },
            }}
          >
            {uploading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default FileUpload;
