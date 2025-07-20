import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';

export default function AMCForm() {
  const navigate = useNavigate();
  const { assetId } = useParams();
  const [formData, setFormData] = useState({
    vendor: '',
    startDate: '',
    endDate: '',
    itemsCovered: '',
    sla: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/amc/${assetId}`, formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to save AMC:', err);
      alert('Error saving AMC. Please check all fields.');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Add AMC Contract</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input name="vendor" placeholder="Vendor Name" onChange={handleChange} required className="border p-2" />
        <input type="date" name="startDate" onChange={handleChange} required className="border p-2" />
        <input type="date" name="endDate" onChange={handleChange} required className="border p-2" />
        <input name="itemsCovered" placeholder="Items Covered" onChange={handleChange} required className="border p-2" />
        <input name="sla" placeholder="SLA (e.g. 48h response)" onChange={handleChange} required className="border p-2" />
        <button className="bg-blue-600 text-white p-2 rounded">Save AMC</button>
      </form>
    </div>
  );
}