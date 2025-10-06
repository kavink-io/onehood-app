import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Paper, Title, Container, Text, Alert } from '@mantine/core';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    blockNo: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    try {
      await register(formData);
      navigate('/'); // Navigate to home on success
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">Join OneHood</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{' '}
        <Link to="/login" style={{color: '#1971c2'}}>Login here</Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          {error && <Alert title="Error" color="red" withCloseButton onClose={() => setError('')} mb="md">{error}</Alert>}
          <TextInput label="Full Name" name="name" placeholder="Name" onChange={handleChange} required />
          <TextInput label="Block / Flat No." name="blockNo" placeholder="B-101" mt="md" onChange={handleChange} required />
          <TextInput label="Email" type="email" name="email" placeholder="you@email.com" mt="md" onChange={handleChange} required />
          <TextInput label="Indian Phone Number"  type="tel" name="phone" placeholder="9876543210" pattern="[0-9]{10}" maxLength="10" mt="md" onChange={handleChange} required />
          <PasswordInput label="Password" name="password" placeholder="Your password" mt="md" onChange={handleChange} required />
          <PasswordInput label="Confirm Password" name="confirmPassword" placeholder="Confirm password" mt="md" onChange={handleChange} required />
          <Button fullWidth mt="xl" type="submit">Register</Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Register;