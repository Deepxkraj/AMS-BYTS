import { Routes, Route } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import DashboardHome from './technician/DashboardHome';
import Assets from './technician/Assets';
import Complaints from './technician/Complaints';
import MapView from './technician/MapView';

const TechnicianDashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="assets" element={<Assets />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="map" element={<MapView />} />
      </Routes>
    </Layout>
  );
};

export default TechnicianDashboard;

