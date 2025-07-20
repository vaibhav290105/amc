import { useEffect, useState } from 'react';
import API from '../services/api';

export default function TechnicianDashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    API.get('/tasks/assigned').then((res) => setTasks(res.data));
  }, []);

  const updateStatus = async (taskId, status) => {
    await API.patch(`/tasks/${taskId}/status`, { status });
    setTasks((prev) => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Technician Tasks</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Asset ID</th>
            <th className="border px-4 py-2">Due Date</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td className="border px-4 py-2">{task.assetId}</td>
              <td className="border px-4 py-2">{new Date(task.dueDate).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{task.status}</td>
              <td className="border px-4 py-2">
                <select onChange={(e) => updateStatus(task.id, e.target.value)} value={task.status}>
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
    </div>
  );
}
