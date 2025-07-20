import { useEffect, useState } from 'react';
import API from '../services/api';

export default function TechnicianDashboard() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await API.get('/amc/assigned');
        console.log("data is:",res.data);
        setAssets(res.data);
      } catch (err) {
        console.error('Failed to load AMC assets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const handleUpdateStatus = async (assetId, status) => {
    try {
      await API.patch(`/amc/${assetId}/status`, { status });
      setAssets(prev => prev.map(a => a.id === assetId ? { ...a, status } : a));
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Technician AMC Dashboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : assets.length === 0 ? (
        <p>No assigned AMC assets found.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Asset</th>
              <th className="border px-4 py-2">Vendor</th>
              <th className="border px-4 py-2">Start Date</th>
              <th className="border px-4 py-2">End Date</th>
              <th className="border px-4 py-2">SLA</th>
              <th className="border px-4 py-2">Items Covered</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td className="border px-4 py-2">{asset.asset?.model || asset.assetId}</td>
                <td className="border px-4 py-2">{asset.vendor}</td>
                <td className="border px-4 py-2">{new Date(asset.startDate).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{new Date(asset.endDate).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{asset.sla}</td>
                <td className="border px-4 py-2">{asset.itemsCovered}</td>
                <td className="border px-4 py-2 font-semibold">{asset.status || 'PENDING'}</td>
                <td className="border px-4 py-2">
                  <select
                    className="border p-1"
                    value={asset.status || 'PENDING'}
                    onChange={(e) => handleUpdateStatus(asset.id, e.target.value)}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="INSPECTED">Inspected</option>
                    <option value="RENEWED">Renewed</option>
                    <option value="FAULTY">Faulty</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
