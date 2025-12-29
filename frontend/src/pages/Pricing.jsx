import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { pricingService } from '../services/api';

export default function Pricing() {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadPricing();
  }, []);

  const loadPricing = async () => {
    try {
      const data = await pricingService.getActive();
      setPricing(data);
      setFormData(data);
    } catch (error) {
      console.error('Error loading pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await pricingService.update(pricing.id, formData);
      setEditing(false);
      loadPricing();
    } catch (error) {
      alert('Error updating pricing: ' + (error.response?.data?.message || 'Unknown error'));
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
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Pricing Configuration</h2>
          <button
            onClick={() => setEditing(!editing)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {!editing ? (
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium text-gray-700">Free Tolerance (minutes)</span>
                <span className="text-gray-900">{pricing?.freeToleranceMinutes}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium text-gray-700">Prorated Fraction (minutes)</span>
                <span className="text-gray-900">{pricing?.proratedFractionMinutes}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium text-gray-700">Hourly Rate</span>
                <span className="text-gray-900">${Number(pricing?.hourlyRate).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium text-gray-700">Daily Cap</span>
                <span className="text-gray-900">${Number(pricing?.dailyCap).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium text-gray-700">Lost Ticket Fee</span>
                <span className="text-gray-900">${Number(pricing?.lostTicketFee).toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Free Tolerance (minutes)
                </label>
                <input
                  type="number"
                  value={formData.freeToleranceMinutes}
                  onChange={(e) => setFormData({ ...formData, freeToleranceMinutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prorated Fraction (minutes)
                </label>
                <input
                  type="number"
                  value={formData.proratedFractionMinutes}
                  onChange={(e) => setFormData({ ...formData, proratedFractionMinutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Cap</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.dailyCap}
                  onChange={(e) => setFormData({ ...formData, dailyCap: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lost Ticket Fee</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.lostTicketFee}
                  onChange={(e) => setFormData({ ...formData, lostTicketFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Update Pricing
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
