import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

export default function AMCDetails() {
  const { assetId } = useParams();
  const [amc, setAmc] = useState(null);

  useEffect(() => {
    const fetchAMC = async () => {
      try {
        const res = await API.get(`/amc/${assetId}`);
        setAmc(res.data);
      } catch (err) {
        console.error('Failed to load AMC details:', err);
      }
    };

    fetchAMC();
  }, [assetId]);

  if (!amc) return <p className="p-4 text-gray-500">Loading AMC details...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">AMC Details</h2>
      <div className="space-y-2">
        <p><strong>Vendor:</strong> {amc.vendor}</p>
        <p><strong>Start Date:</strong> {amc.startDate.slice(0, 10)}</p>
        <p><strong>End Date:</strong> {amc.endDate.slice(0, 10)}</p>
        <p><strong>Items Covered:</strong> {amc.itemsCovered}</p>
        <p><strong>SLA:</strong> {amc.sla}</p>
      </div>
    </div>
  );
}
