import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';
import { useUsers } from '../hooks/useUsers';
import { useLoading } from '../hooks/useLoading';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { createUser } = useUsers();
  const { isLoading, execute } = useLoading();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.firstName || !formData.lastName) {
      toast.error('Please fill in required fields');
      return;
    }

    const result = await execute(async () => {
      await createUser(formData);
      toast.success('Account created successfully');
      navigate('/login');
    });

    if (result) {
      setFormData({ email: '', firstName: '', lastName: '', phone: '', city: '' });
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <Card title="Create Account">
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
            <FormInput
              label="First Name"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
            />
            <FormInput
              label="Last Name"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              required
            />
            <FormInput
              label="Phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
            <FormInput
              label="City"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter your city"
            />
            <Button type="submit" isLoading={isLoading} style={{ width: '100%' }}>
              Sign Up
            </Button>
          </form>
          <p style={{ marginTop: '1rem', textAlign: 'center', color: '#666' }}>
            Already have an account? <a href="/login" style={{ color: '#1a5490', textDecoration: 'none' }}>Login</a>
          </p>
        </Card>
      </div>
    </Layout>
  );
};
