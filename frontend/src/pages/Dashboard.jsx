import { useEffect, useState } from 'react';
import API from '../services/api';

export default function Dashboard() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    API.get('/assets').then(res => setAssets(res.data));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Asset Dashboard</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Type</th>
            <th>Model</th>
            <th>Warranty Expiry</th>
            <th>AMC</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(a => (
            <tr key={a.id}>
              <td>{a.type}</td>
              <td>{a.model}</td>
              <td>{a.warrantyExpiresAt.slice(0, 10)}</td>
              <td>{a.underAmc ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
