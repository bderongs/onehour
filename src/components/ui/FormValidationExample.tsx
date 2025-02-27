// Purpose: Example component demonstrating how to use the FormValidation utilities
// This component shows a simple form with validation using the shared FormValidation component

import { useState } from 'react';
import { useValidationStyles, validateAndScrollToFirstError } from './FormValidation';

type FormData = {
  name: string;
  email: string;
  message: string;
};

export default function FormValidationExample() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });
  const [error, setError] = useState<string | null>(null);

  // Use the validation styles hook
  useValidationStyles();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate each field
    const validationResults = [
      {
        isValid: formData.name.trim() !== '',
        fieldId: 'name',
        data: formData.name
      },
      {
        isValid: formData.email.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
        fieldId: 'email',
        data: formData.email
      },
      {
        isValid: formData.message.trim() !== '',
        fieldId: 'message',
        data: formData.message
      }
    ];
    
    // Use the shared validation utility
    const isValid = validateAndScrollToFirstError(
      validationResults,
      (message) => setError(message),
      'Please fill in all required fields correctly'
    );
    
    if (isValid) {
      // Form is valid, proceed with submission
      setError(null);
      console.log('Form submitted:', formData);
      // Reset form after submission
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Contact Form</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
} 