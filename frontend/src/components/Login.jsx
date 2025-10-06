import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Paper, Title, Container, Text, Alert } from '@mantine/core';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">Welcome back!</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{' '}
        <Link to="/register" style={{color: '#1971c2'}}>Create account</Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleLogin}>
          {error && <Alert title="Error" color="red" withCloseButton onClose={() => setError('')} mb="md">{error}</Alert>}
          <TextInput label="Email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.currentTarget.value)} required />
          <PasswordInput label="Password" placeholder="Your password" mt="md" value={password} onChange={(e) => setPassword(e.currentTarget.value)} required />
          <Button fullWidth mt="xl" type="submit">Sign in</Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Login;