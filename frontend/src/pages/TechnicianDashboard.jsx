import { useEffect, useState } from 'react';
import API from '../services/api';

export default function TechnicianDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remarksMap, setRemarksMap] = useState({});

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await API.get('/tasks/my');
        setTasks(res.data);
      } catch (err) {
        console.error('Failed to load tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, status) => {
    const remarks = remarksMap[taskId] || '';

    try {
      await API.put(`/tasks/${taskId}/update`, { status, remarks });

      setTasks(prev =>
        prev.map(t =>
          t.id === taskId
            ? { ...t, status, remarks: status === 'FAULTY' ? remarks : '' }
            : t
        )
      );

      if (status !== 'FAULTY') {
        setRemarksMap(prev => ({ ...prev, [taskId]: '' }));
      }
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const handleRemarksChange = (taskId, value) => {
    setRemarksMap(prev => ({ ...prev, [taskId]: value }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Technician Task Dashboard</h2>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks assigned.</p>
      ) : (
        <table className="w-full border rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Asset</th>
              <th className="border px-4 py-2">Task Title</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Due Date</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="bg-white hover:bg-gray-50 transition">
                <td className="border px-4 py-2">{task.asset?.model || task.assetId}</td>
                <td className="border px-4 py-2">{task.title}</td>
                <td className="border px-4 py-2">{task.description}</td>
                <td className="border px-4 py-2">
                  {new Date(task.dueDate).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2 font-semibold uppercase text-sm">
                  {task.status}
                </td>
                <td className="border px-4 py-2 space-y-2">
                  <select
                    className="border p-1 rounded w-full"
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="INSPECTED">Inspected</option>
                    <option value="RENEWED">Renewed</option>
                    <option value="FAULTY">Faulty</option>
                  </select>

                  {task.status === 'FAULTY' && (
                    <textarea
                      placeholder="Enter remarks for faulty asset"
                      className="w-full border mt-1 p-2 rounded resize-none"
                      rows={2}
                      value={remarksMap[task.id] || ''}
                      onChange={(e) => handleRemarksChange(task.id, e.target.value)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
