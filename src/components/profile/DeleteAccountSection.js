import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { parseError } from '../../api/errors';

function DeleteAccountSection() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setError('');
        if (!password) {
            setError('Please enter your password to confirm.');
            return;
        }
        setLoading(true);
        try {
            await client.delete('/users/profile/', { data: { password } });
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            navigate('/login');
        } catch (err) {
            setError(parseError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <h2>Delete Account</h2>
            <p>This action is irreversible. Enter your password to confirm.</p>
            <input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="form-error">{error}</p>}
            <button onClick={handleDelete} disabled={loading}>
                {loading ? 'Deleting...' : 'Delete Account'}
            </button>
        </section>
    );
}

export default DeleteAccountSection;