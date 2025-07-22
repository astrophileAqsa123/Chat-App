import { useState } from 'react';
import { axiosInstance } from "../lib/axios";
import { useNavigate } from 'react-router-dom';

const AddContactPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await axiosInstance.post('/contacts/add-by-email', { email });
      setSuccessMsg("✅ Contact added successfully!");
      setEmail('');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Add New Contact</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Contact Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="Enter email address"
            style={styles.input}
          />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Adding...' : 'Add Contact'}
          </button>
        </form>

        {successMsg && <p style={styles.success}>{successMsg}</p>}
        {errorMsg && <p style={styles.error}>{errorMsg}</p>}

        <button onClick={() => navigate("/")} style={styles.backButton}>
          Back to Chat
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    background: '#f3f4f6',
  },
  card: {
    background: '#fff',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.15)',
    width: '400px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    display: 'flex', 
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
  },
  input: {
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    background: '#2563eb',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  backButton: {
    marginTop: '20px',
    padding: '8px',
    background: '#f3f4f6',
    border: '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  success: {
    color: 'green',
    marginTop: '10px',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginTop: '10px',
    textAlign: 'center',
  },
};

export default AddContactPage;
