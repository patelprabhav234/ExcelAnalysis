# Excel File Analysis Platform

A full-stack web application for uploading, analyzing, and visualizing Excel files with interactive charts.

## Features

- Secure user authentication with JWT
- Excel file upload and parsing
- Interactive 2D/3D data visualization
- Chart customization (X and Y axis selection)
- Chart download as PNG
- Analysis history tracking
- Admin dashboard for user management

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Multer for file uploads
- SheetJS for Excel parsing

### Frontend
- React
- Material-UI
- Chart.js for 2D charts
- Three.js for 3D visualizations
- Axios for API calls

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd excel-analyzer
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/excel-analyzer
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=24h
```

5. Create the uploads directory in the backend:
```bash
cd ../backend
mkdir uploads
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

1. Register a new account or login with existing credentials
2. Upload an Excel file (.xlsx or .xls)
3. Select columns for X and Y axes
4. Choose chart type (Line or Bar)
5. View and download the generated chart
6. Access analysis history from the dashboard

## Admin Features

1. Login with admin credentials
2. View platform statistics
3. Manage users (view, delete)
4. Monitor file uploads and analyses

## Security

- JWT-based authentication
- Password encryption
- Role-based access control
- Secure file upload handling

## License

MIT 