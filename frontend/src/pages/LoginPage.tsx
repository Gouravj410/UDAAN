import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';
import { useAuthStore } from '../context/authStore';
import { useLoading } from '../hooks/useLoading';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { isLoading, execute } = useLoading();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    const result = await execute(async () => {
      await login(email, password);
      toast.success('Login successful');
      navigate('/dashboard');
    });

    if (result === null && password) {
      toast.error('Invalid credentials');
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
        <Card title="Login">
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <FormInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <Button type="submit" isLoading={isLoading} style={{ width: '100%' }}>
              Login
            </Button>
          </form>
          <p style={{ marginTop: '1rem', textAlign: 'center', color: '#666' }}>
            Need an account? <a href="/signup" style={{ color: '#1a5490', textDecoration: 'none' }}>Sign up</a>
          </p>
        </Card>
      </div>
    </Layout>
  );
};
