import React, { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client';

const SimpleAdmin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Test connection on load
  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const { data, error } = await supabase.from('admins').select('count', { count: 'exact', head: true });
      if (error) {
        setError('Connection failed: ' + error.message);
      } else {
        setError('✅ Connection successful');
      }
    } catch (err) {
      setError('❌ Connection error: ' + err.message);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        setError('❌ Invalid credentials');
      } else {
        setError('✅ Login successful');
        setIsLoggedIn(true);
        loadRegistrations();
      }
    } catch (err) {
      setError('❌ Login error: ' + err.message);
    }
    setLoading(false);
  };

  const loadRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError('❌ Error loading registrations: ' + error.message);
      } else {
        setRegistrations(data || []);
        setError('✅ Registrations loaded: ' + (data?.length || 0));
      }
    } catch (err) {
      setError('❌ Load error: ' + err.message);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        alert('❌ Update failed: ' + error.message);
      } else {
        alert('✅ Status updated to: ' + newStatus);
        loadRegistrations();
      }
    } catch (err) {
      alert('❌ Update error: ' + err.message);
    }
  };

  // Simple inline styles
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    card: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '20px',
      maxWidth: '1200px',
      margin: '0 auto 20px auto'
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '5px 0',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px'
    },
    button: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      margin: '5px',
      fontSize: '14px'
    },
    buttonGreen: {
      backgroundColor: '#28a745',
      color: 'white',
      padding: '5px 10px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      margin: '2px',
      fontSize: '12px'
    },
    buttonRed: {
      backgroundColor: '#dc3545',
      color: 'white',
      padding: '5px 10px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      margin: '2px',
      fontSize: '12px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '10px'
    },
    th: {
      backgroundColor: '#f8f9fa',
      padding: '10px',
      textAlign: 'left',
      borderBottom: '2px solid #dee2e6'
    },
    td: {
      padding: '8px',
      borderBottom: '1px solid #dee2e6'
    },
    status: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold'
    },
    statusPending: {
      backgroundColor: '#fff3cd',
      color: '#856404'
    },
    statusApproved: {
      backgroundColor: '#d4edda',
      color: '#155724'
    },
    statusRejected: {
      backgroundColor: '#f8d7da',
      color: '#721c24'
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1>🔐 Simple Admin Login</h1>
          
          <div style={{ padding: '10px', backgroundColor: error.includes('✅') ? '#d4edda' : '#f8d7da', borderRadius: '4px', margin: '10px 0' }}>
            {error || 'Ready to test connection...'}
          </div>

          <button style={styles.button} onClick={testConnection}>
            🔄 Test Connection
          </button>

          <div style={{ marginTop: '20px' }}>
            <input
              style={styles.input}
              type="text"
              placeholder="Username (try: evaadmin)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Password (try: eva919123)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              style={styles.button} 
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? '⏳ Logging in...' : '🚀 Login'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>📊 Admin Dashboard</h1>
          <button style={styles.button} onClick={() => setIsLoggedIn(false)}>
            🚪 Logout
          </button>
        </div>
        
        <div style={{ padding: '10px', backgroundColor: error.includes('✅') ? '#d4edda' : '#f8d7da', borderRadius: '4px', margin: '10px 0' }}>
          {error}
        </div>

        <button style={styles.button} onClick={loadRegistrations}>
          🔄 Refresh Data
        </button>

        <h2>📋 Registrations ({registrations.length})</h2>
        
        {registrations.length === 0 ? (
          <p>No registrations found. Click "Refresh Data" to load.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Customer ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Mobile</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id}>
                    <td style={styles.td}>{reg.customer_id}</td>
                    <td style={styles.td}>{reg.name}</td>
                    <td style={styles.td}>{reg.category_name}</td>
                    <td style={styles.td}>{reg.mobile_number}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.status,
                        ...(reg.status === 'pending' ? styles.statusPending :
                            reg.status === 'approved' ? styles.statusApproved :
                            styles.statusRejected)
                      }}>
                        {reg.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {reg.status === 'pending' && (
                        <>
                          <button 
                            style={styles.buttonGreen}
                            onClick={() => updateStatus(reg.id, 'approved')}
                          >
                            ✅ Approve
                          </button>
                          <button 
                            style={styles.buttonRed}
                            onClick={() => updateStatus(reg.id, 'rejected')}
                          >
                            ❌ Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleAdmin;