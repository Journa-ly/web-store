'use client';

import { useState } from 'react';
import { userRequests, User } from 'requests/users';

interface ProfileFormProps {
  user: User | undefined;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone_number: user?.phone_number || '',
    accepts_marketing: user?.accepts_marketing || false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', content: '' });

    try {
      await userRequests.updateUser(formData);
      setMessage({ type: 'success', content: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', content: 'Failed to update profile.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          value={user?.email || ''}
          disabled
          className="input input-bordered w-full bg-base-200"
        />
      </div>

      <div>
        <label className="label">
          <span className="label-text">Username</span>
        </label>
        <input
          type="text"
          value={user?.username || ''}
          disabled
          className="input input-bordered w-full bg-base-200"
        />
      </div>

      <div>
        <label className="label">
          <span className="label-text">First Name</span>
        </label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
      </div>

      <div>
        <label className="label">
          <span className="label-text">Last Name</span>
        </label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
      </div>

      <div>
        <label className="label">
          <span className="label-text">Phone Number</span>
        </label>
        <input
          type="tel"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
      </div>

      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-2">
          <input
            type="checkbox"
            name="accepts_marketing"
            checked={formData.accepts_marketing}
            onChange={handleChange}
            className="checkbox-primary checkbox"
          />
          <span className="label-text">Receive marketing emails</span>
        </label>
      </div>

      {message.content && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          {message.content}
        </div>
      )}

      <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
        {isSubmitting ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
}
