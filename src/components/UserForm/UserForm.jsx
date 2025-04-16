import React, { useState } from 'react';
import './UserForm.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// Convert camelCase to snake_case
const toSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

// Convert form data keys from camelCase to snake_case
const convertFormDataToSnakeCase = (formData) => {
  const converted = {};
  for (const [key, value] of Object.entries(formData)) {
    converted[toSnakeCase(key)] = value;
  }
  return converted;
};

const UserForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    age: '',
    gender: '',
    email: '',
    schoolName: '',
    address: '',
    city: ''
  });

  const [previewFolder, setPreviewFolder] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emptyField = Object.values(formData).some(value => value.trim() === '');

    if (emptyField) {
      toast.error('You need to fill all fields first!');
      return;
    }

    try {
      const dataToSend = convertFormDataToSnakeCase(formData);
      const res = await axios.post('http://localhost:5000/submit_student', dataToSend, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (res.data.error) {
        toast.error(res.data.error);
        return;
      }

      const newStudent = {
        ...res.data.student,
        match: res.data.match
      };

      if (res.data.match) {
        toast.success('Match found!');
      } else {
        toast.info('No matching student found.');
      }

      setPreviewFolder(prev => [...prev, newStudent]);

    } catch (error) {
      console.error('Request error:', error);
      toast.error(`Error connecting to the server: ${error.message}`);
    }
  };

  const renderPreviewFolder = () => {
    if (!previewFolder || previewFolder.length === 0) {
      return <p>No students in preview folder.</p>;
    }

    return (
      <div className="preview-folder">
        <h3>Preview Folder</h3>
        <ul>
          {previewFolder.map((student, index) => (
            student && student.first_name ? (
              <li key={index}>
                <p><strong>First Name:</strong> {student.first_name}</p>
                <p><strong>Second Name:</strong> {student.second_name}</p>
                <p><strong>Age:</strong> {student.age}</p>
                <p><strong>Gender:</strong> {student.gender}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>School Name:</strong> {student.school_name}</p>
                <p><strong>Address:</strong> {student.address}</p>
                <p><strong>City:</strong> {student.city}</p>
                <p><strong>Result:</strong> {student.match ? 'Pass' : 'Fail'}</p>
              </li>
            ) : null
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="form-container">
      <h2>Student Information Form</h2>
      <div className="user-form">
        {Object.entries(formData).map(([key, value]) => (
          <div className="form-group" key={key}>
            <label>{key.replace(/([A-Z])/g, ' $1')}</label>
            {key === 'gender' ? (
              <select name={key} onChange={handleChange} value={value}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <input
                type={key === 'age' ? 'number' : key === 'email' ? 'email' : 'text'}
                name={key}
                placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                value={value}
                onChange={handleChange}
              />
            )}
          </div>
        ))}

        <button onClick={handleSubmit} className="submit-btn">Submit</button>
      </div>
      <ToastContainer />
      {renderPreviewFolder()}
    </div>
  );
};

export default UserForm;
