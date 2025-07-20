import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';

export default function AssetForm() {
  const { assetId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: '',
    model: '',
    serialNumber: '',
    installationDate: '',
    warrantyExpiry: '',
    location: '',
    licenseNumber: '',
    licenseExpiry: '',
    underAMC: false,
    technicianId: '', // 👈 new field
  });

  const [technicians, setTechnicians] = useState([]);

  // Fetch technicians
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const res = await API.get('http://localhost:5000/api/auth/technicians');
        setTechnicians(res.data);
      } catch (err) {
        console.error('Failed to load technicians', err);
      }
    };
    fetchTechnicians();
  }, []);

  // Fetch existing asset (edit mode)
  useEffect(() => {
    const fetchAsset = async () => {
      if (assetId) {
        try {
          const res = await API.get(`/assets/${assetId}`);
          const asset = res.data;

          setFormData({
            ...asset,
            installationDate: asset.installationDate?.slice(0, 10) || '',
            warrantyExpiry: asset.warrantyExpiry?.slice(0, 10) || '',
            licenseExpiry: asset.licenseExpiry?.slice(0, 10) || '',
            underAMC: asset.underAMC || false,
            technicianId: asset.technicianId || '',
          });
        } catch (err) {
          console.error('Failed to fetch asset:', err);
        }
      }
    };
    fetchAsset();
  }, [assetId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (assetId) {
        await API.put(`/assets/${assetId}`, formData);
      } else {
        await API.post('/assets', formData);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Submit Error:', err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">
        {assetId ? 'Edit Asset' : 'Add New Asset'}
      </h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        {['type', 'model', 'serialNumber', 'location'].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field}
            value={formData[field]}
            onChange={handleChange}
            className="border p-2"
            required
          />
        ))}

        <label>
          Installation Date:
          <input
            type="date"
            name="installationDate"
            value={formData.installationDate}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </label>

        <label>
          Warranty Expiry:
          <input
            type="date"
            name="warrantyExpiry"
            value={formData.warrantyExpiry}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </label>

        <label>
          License Number:
          <input
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </label>

        <label>
          License Expiry:
          <input
            type="date"
            name="licenseExpiry"
            value={formData.licenseExpiry}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </label>

        <label className="flex gap-2 items-center">
          <input
            type="checkbox"
            name="underAMC"
            checked={formData.underAMC}
            onChange={handleChange}
          />
          Under AMC
        </label>

        <label>
          Assign Technician:
          <select
            name="technicianId"
            value={formData.technicianId}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="">-- Select Technician --</option>
            {technicians.map((tech) => (
              <option key={tech.id} value={tech.id}>
                {tech.name}
              </option>
            ))}
          </select>
        </label>

        <button className="bg-blue-600 text-white p-2 rounded" type="submit">
          {assetId ? 'Update' : 'Add'} Asset
        </button>
      </form>
    </div>
  );
}
