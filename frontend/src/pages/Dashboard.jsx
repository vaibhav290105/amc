import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Dashboard() {
  const [assets, setAssets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await API.get('/assets');
        setAssets(res.data);
      } catch (error) {
        console.error('Failed to load assets:', error);
      }
    };

    fetchAssets();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Asset Dashboard</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate('/add-asset')}
        >
          + Add Asset
        </button>
      </div>

      {assets.length === 0 ? (
        <p className="text-gray-500">No assets found.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300 bg-white shadow text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Type</th>
              <th className="border p-2">Model</th>
              <th className="border p-2">Warranty Expiry</th>
              <th className="border p-2">License Expiry</th>
              <th className="border p-2">Location</th>
              <th className="border p-2">Technician</th>
              <th className="border p-2">AMC Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-50">
                <td className="border p-2">{asset.type}</td>
                <td className="border p-2">{asset.model}</td>
                <td className="border p-2">
                  {asset.warrantyExpiry?.slice(0, 10) || 'N/A'}
                </td>
                <td className="border p-2">
                  {asset.licenseExpiry?.slice(0, 10) || 'N/A'}
                </td>
                <td className="border p-2">{asset.location || 'N/A'}</td>

                <td className="border p-2">
                  {asset.technician?.name || (
                    <span className="text-gray-500 italic">Unassigned</span>
                  )}
                </td>

                <td className="border p-2 text-center">
                  {asset.underAMC ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                      Active
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">
                      None
                    </span>
                  )}
                </td>

                <td className="border p-2 flex flex-wrap gap-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                    onClick={() => navigate(`/edit-asset/${asset.id}`)}
                  >
                    Edit
                  </button>

                  <button
                    className={`${
                      asset.amc ? 'bg-purple-600' : 'bg-blue-600'
                    } text-white px-2 py-1 rounded text-sm`}
                    onClick={() =>
                      navigate(
                        asset.amc
                          ? `/asset/${asset.id}/amc-details`
                          : `/asset/${asset.id}/amc-create`
                      )
                    }
                    >
                    {asset.amc ? 'AMC Details' : 'Add AMC'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
