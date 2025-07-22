import { useState } from 'react';
import { axiosInstance } from "../lib/axios.js";

const AddContactModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await axiosInstance.post('/contacts/add-by-email', { email });
      setSuccessMsg("✅ Contact added successfully!");
      setEmail('');
      window.location.reload(); 
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">Add New Contact</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-800 dark:hover:text-white text-xl">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-700 dark:text-zinc-300 mb-1">Contact Email:</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 dark:text-white"
              placeholder="Enter email address"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            {loading ? 'Adding...' : 'Add Contact'}
          </button>
        </form>

        {successMsg && <p className="text-green-600 text-center mt-3">{successMsg}</p>}
        {errorMsg && <p className="text-red-600 text-center mt-3">{errorMsg}</p>}
      </div>
    </div>
  );
};

export default AddContactModal;
