import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadarController,
  RadialLinearScale,
  BubbleController,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import {
  Line,
  Bar,
  Pie,
  Doughnut,
  Radar,
  Bubble,
} from 'react-chartjs-2';
import axios from 'axios';
import Plot from 'react-plotly.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadarController,
  RadialLinearScale,
  BubbleController,
  Title,
  Tooltip,
  Legend
);

const Analysis = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const [fileData, setFileData] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [selectedX, setSelectedX] = useState('');
  const [selectedY, setSelectedY] = useState('');
  const [chartType, setChartType] = useState('line');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFileData();
  }, [fileId]);

  useEffect(() => {
    if (fileData && headers.length > 1) {
      setSelectedX(headers[0]);
      setSelectedY(headers[1]);
    }
  }, [fileData, headers]);

  const fetchFileData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/files/${fileId}/data`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFileData(response.data.data);
      setHeaders(response.data.headers);
    } catch (err) {
      setError('Failed to fetch file data');
    }
  };

  const handleSaveAnalysis = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/analysis/${fileId}`,
        { chartType, xAxis: selectedX, yAxis: selectedY },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      setError('Failed to save analysis');
    }
  };

  const prepareChartData = () => {
    if (!fileData || !selectedX || !selectedY) return null;
    const labels = fileData.map(item => item[selectedX]);
    const data = fileData.map(item => item[selectedY]);

    return {
      labels,
      datasets: [
        {
          label: `${selectedY} vs ${selectedX}`,
          data,
          backgroundColor: [
            '#34D399', '#60A5FA', '#FBBF24', '#F87171', '#A78BFA',
            '#4ADE80', '#F472B6', '#FACC15', '#38BDF8', '#FB7185'
          ],
          borderColor: 'rgba(0,0,0,0.1)',
          borderWidth: 1,
          fill: chartType === 'line',
          tension: 0.3,
        },
      ],
    };
  };

  const downloadChart = () => {
    if (chartType === '3d') {
      const plotlyElement = document.getElementById('plotly-chart');
      if (plotlyElement) {
        window.Plotly.downloadImage(plotlyElement, {
          format: 'png',
          filename: '3d-chart',
          height: 600,
          width: 800,
          scale: 2,
        });
      } else {
        console.error("Plotly chart not found");
      }
    } else {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = 'chart.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    }
  };

  const renderChart = () => {
    const chartData = prepareChartData();
    if (!chartData) return null;

    if (chartType === '3d') {
      const x = fileData.map(item => item[selectedX]);
      const y = fileData.map(item => item[selectedY]);
      const z = fileData.map((_, i) => i);

      return (
        <Plot
          data={[
            {
              x,
              y,
              z,
              mode: 'markers',
              type: 'scatter3d',
              marker: { size: 4, color: z, colorscale: 'Viridis' },
            },
          ]}
          layout={{
            margin: { l: 0, r: 0, b: 0, t: 30 },
            height: 400,
            title: `${selectedY} vs ${selectedX} (3D)`,
            scene: {
              xaxis: { title: selectedX },
              yaxis: { title: selectedY },
              zaxis: { title: 'Index' },
            },
          }}
          config={{ responsive: true }}
          divId="plotly-chart"
        />
      );
    }

    const options = {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: `${selectedY} vs ${selectedX}`,
          font: { size: 18 },
        },
      },
    };

    switch (chartType) {
      case 'line': return <Line data={chartData} options={options} />;
      case 'bar': return <Bar data={chartData} options={options} />;
      case 'pie': return <Pie data={chartData} options={options} />;
      case 'doughnut': return <Doughnut data={chartData} options={options} />;
      case 'radar': return <Radar data={chartData} options={options} />;
      case 'bubble':
        const bubbleData = {
          datasets: fileData.map((item, index) => ({
            label: `${selectedY} at ${item[selectedX]}`,
            data: [{ x: index, y: item[selectedY], r: Math.abs(item[selectedY]) / 2 || 5 }],
            backgroundColor: `rgba(${(index * 30) % 255}, ${(index * 50) % 255}, ${(index * 70) % 255}, 0.6)`
          })),
        };
        return <Bubble data={bubbleData} options={options} />;
      default: return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
              background: 'linear-gradient(to right, #ffffff, #f9fafb)',
            }}
          >
            <Typography variant="h5" gutterBottom className="text-green-700 font-bold">
              Data Analysis
            </Typography>

            {error && (
              <Typography color="error" gutterBottom>
                {error}
              </Typography>
            )}

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>X Axis</InputLabel>
                  <Select value={selectedX} label="X Axis" onChange={(e) => setSelectedX(e.target.value)}>
                    {headers.map((header) => (
                      <MenuItem key={header} value={header}>
                        {header}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Y Axis</InputLabel>
                  <Select value={selectedY} label="Y Axis" onChange={(e) => setSelectedY(e.target.value)}>
                    {headers.map((header) => (
                      <MenuItem key={header} value={header}>
                        {header}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Chart Type</InputLabel>
                  <Select value={chartType} label="Chart Type" onChange={(e) => setChartType(e.target.value)}>
                    <MenuItem value="line">Line Chart</MenuItem>
                    <MenuItem value="bar">Bar Chart</MenuItem>
                    <MenuItem value="pie">Pie Chart</MenuItem>
                    <MenuItem value="doughnut">Doughnut Chart</MenuItem>
                    <MenuItem value="radar">Radar Chart</MenuItem>
                    <MenuItem value="bubble">Bubble Chart</MenuItem>
                    <MenuItem value="3d">3D Scatter Chart</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ height: 400, mb: 2 }}>{renderChart()}</Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={handleSaveAnalysis} className="bg-green-600 text-white">
                Save Analysis
              </Button>
              <Button variant="outlined" onClick={downloadChart}>
                Download Chart
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
export default Analysis;
