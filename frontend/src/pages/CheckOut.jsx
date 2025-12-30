import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { staysService, paymentsService } from '../services/api';

export default function CheckOut() {
  const [activeStays, setActiveStays] = useState([]);
  const [selectedStay, setSelectedStay] = useState(null);
  const [isLostTicket, setIsLostTicket] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [calculatedFee, setCalculatedFee] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadActiveStays();
  }, []);

  const loadActiveStays = async () => {
    try {
      const stays = await staysService.getActive();
      setActiveStays(stays);
    } catch (err) {
      console.error('Error loading stays:', err);
    }
  };

  const handleCheckOut = async () => {
    if (!selectedStay) return;

    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const checkOutData = await staysService.checkOut({
        stayId: selectedStay.id,
        isLostTicket,
      });
      
      setCalculatedFee(checkOutData.calculatedFee);

      await paymentsService.create({
        stayId: checkOutData.id,
        amount: checkOutData.calculatedFee,
        method: paymentMethod,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Check-Out</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Stays List */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Vehicle</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {activeStays.map((stay) => (
                <button
                  key={stay.id}
                  onClick={() => setSelectedStay(stay)}
                  className={`w-full text-left p-4 border rounded-md ${
                    selectedStay?.id === stay.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{stay.vehicle.plate}</div>
                  <div className="text-sm text-gray-600">
                    Slot: {stay.slot.number} | Type: {stay.vehicle.type}
                  </div>
                  <div className="text-sm text-gray-500">
                    Check-in: {new Date(stay.checkInTime).toLocaleString()}
                  </div>
                </button>
              ))}
              {activeStays.length === 0 && (
                <p className="text-center text-gray-500 py-8">No active stays</p>
              )}
            </div>
          </div>

          {/* Check-Out Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Check-Out Details</h3>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm mb-4">
                Check-out successful! Fee: ${calculatedFee.toFixed(2)}
              </div>
            )}

            {selectedStay ? (
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isLostTicket}
                      onChange={(e) => setIsLostTicket(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Lost Ticket</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="pix">PIX</option>
                  </select>
                </div>

                <button
                  onClick={handleCheckOut}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Complete Check-Out'}
                </button>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Select a vehicle to check out</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
