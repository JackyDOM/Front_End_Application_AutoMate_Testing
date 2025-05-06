import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './UserForm.css';

// Convert camelCase to snake_case
const toSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
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
    city: '',
    image: null,
  });

  const [previewFolder, setPreviewFolder] = useState([]);
  const [fieldComparisons, setFieldComparisons] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emptyField = Object.entries(formData)
      .filter(([key]) => key !== 'image')
      .some(([_, value]) => value.toString().trim() === '');

    if (emptyField || !formData.image) {
      toast.error('You need to fill all fields and upload an image!');
      return;
    }

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(toSnakeCase(key), formData[key]);
      }

      const res = await axios.post('http://localhost:5000/submit_student', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.error) {
        toast.error(res.data.error);
        return;
      }

      const newStudent = {
        ...res.data.student,
        match: res.data.match,
      };

      setFieldComparisons(res.data.field_comparisons || []);
      if (res.data.match) {
        toast.success('Match found!');
      } else {
        toast.info(`No matching student found. Mismatched fields: ${res.data.mismatch_fields.join(', ')}`);
      }

      setPreviewFolder((prev) => [...prev, newStudent]);
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
                <p><strong>School Name:</strong> {student.school_name || 'N/A'}</p>
                <p><strong>City:</strong> {student.city || 'N/A'}</p>
                <p><strong>Image Name:</strong> {student.image_name || 'No Image'}</p>
                <p><strong>Result:</strong> {student.match ? 'Pass' : 'Fail'}</p>
              </li>
            ) : null
          ))}
        </ul>
      </div>
    );
  };

  const renderFieldComparisons = () => {
    if (!fieldComparisons || fieldComparisons.length === 0) {
      return <p>No field comparisons available.</p>;
    }

    return (
      <div className="field-comparisons">
        <h3>Field Comparisons</h3>
        {fieldComparisons.map((row, index) => (
          <div key={index} className="mb-4">
            <h4 className="font-bold">
              Row {row.row_id} {row.manual_match_result ? '(Match)' : ''}
            </h4>
            <ul>
              {row.comparisons.map((comp, idx) => (
                <li key={idx} className={comp.result.toLowerCase()}>
                  backend {comp.backend_value} == frontend {comp.frontend_value} =&gt; {comp.result}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="form-container">
      <h2 className="text-2xl font-bold mb-4">Student Information Form</h2>
      <div className="user-form">
        {Object.entries(formData).map(([key, value]) => (
          key !== 'image' && (
            <div className="form-group" key={key}>
              <label className="capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </label>
              {key === 'gender' ? (
                <select
                  name={key}
                  onChange={handleChange}
                  value={value}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <input
                  type={
                    key === 'age' ? 'number' : key === 'email' ? 'email' : 'text'
                  }
                  name={key}
                  placeholder={`Enter ${key
                    .replace(/([A-Z])/g, ' $1')
                    .toLowerCase()}`}
                  value={value}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              )}
            </div>
          )
        ))}

        <div className="form-group">
          <label>Upload Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <button onClick={handleSubmit} className="submit-btn">
          Submit
        </button>
      </div>
      <ToastContainer />
      {renderPreviewFolder()}
      {renderFieldComparisons()}
    </div>
  );
};

export default UserForm;