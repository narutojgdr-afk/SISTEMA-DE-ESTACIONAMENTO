import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { slotsService, staysService } from '../services/api';

// Helper function to get vehicle type display with emoji
const getVehicleTypeDisplay = (type) => {
  const typeMap = {
    car: '🚗 Car',
    moto: '🏍️ Motorcycle',
    pcd: '♿ PCD'
  };
  return typeMap[type] || type;
};

export default function Dashboard() {
  const [occupancy, setOccupancy] = useState(null);
  const [activeStays, setActiveStays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [occupancyData, staysData] = await Promise.all([
        slotsService.getOccupancy(),
        staysService.getActive(),
      ]);
      setOccupancy(occupancyData);
      setActiveStays(staysData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h2>

        {/* Occupancy Stats - Enhanced with better spacing and hover effects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Total Slots</h3>
            <p className="text-4xl font-bold text-gray-900">{occupancy?.total || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-3">Occupied</h3>
            <p className="text-4xl font-bold text-blue-700">{occupancy?.occupied || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-green-200">
            <h3 className="text-sm font-semibold text-green-900 uppercase tracking-wide mb-3">Available</h3>
            <p className="text-4xl font-bold text-green-700">{occupancy?.available || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-purple-200">
            <h3 className="text-sm font-semibold text-purple-900 uppercase tracking-wide mb-3">Occupancy Rate</h3>
            <p className="text-4xl font-bold text-purple-700">{occupancy?.occupancyRate || 0}%</p>
          </div>
        </div>

        {/* By Type - Enhanced cards with better visual hierarchy */}
        <h3 className="text-2xl font-bold text-gray-900 mb-6">By Vehicle Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {occupancy?.byType?.map((type) => (
            <div key={type.type} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-5 capitalize">
                {getVehicleTypeDisplay(type.type)}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Total Slots</span>
                  <span className="text-lg font-bold text-gray-900">{type.total}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Occupied</span>
                  <span className="text-lg font-bold text-blue-600">{type.occupied}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-600">Available</span>
                  <span className="text-lg font-bold text-green-600">{type.available}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Active Stays - Enhanced table design */}
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Active Stays</h3>
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Plate</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Slot</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Check-In</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeStays.map((stay) => (
                  <tr key={stay.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {stay.vehicle.plate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {stay.vehicle.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {stay.slot.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(stay.checkInTime).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {activeStays.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg font-medium">No active stays</p>
                <p className="text-sm text-gray-400 mt-1">Check-in vehicles to see them here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
