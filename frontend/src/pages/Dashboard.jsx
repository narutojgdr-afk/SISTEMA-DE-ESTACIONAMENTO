import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { slotsService, staysService } from '../services/api';

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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

        {/* Occupancy Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Slots</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{occupancy?.total || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Occupied</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{occupancy?.occupied || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Available</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{occupancy?.available || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Occupancy Rate</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">{occupancy?.occupancyRate || 0}%</p>
          </div>
        </div>

        {/* By Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {occupancy?.byType?.map((type) => (
            <div key={type.type} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">{type.type}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="text-sm font-medium">{type.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Occupied:</span>
                  <span className="text-sm font-medium text-blue-600">{type.occupied}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Available:</span>
                  <span className="text-sm font-medium text-green-600">{type.available}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Active Stays */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Active Stays</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slot</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-In</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeStays.map((stay) => (
                  <tr key={stay.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {stay.vehicle.plate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {stay.vehicle.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stay.slot.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(stay.checkInTime).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {activeStays.length === 0 && (
              <div className="text-center py-8 text-gray-500">No active stays</div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
