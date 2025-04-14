import React from 'react';
import './UserForm.css';

const UserForm = () => {
  return (
    <div className="form-container">
      <h2>Student Information Form</h2>
      <form className="user-form">
        <div className="form-group">
          <label>First Name</label>
          <input type="text" placeholder="Enter first name" />
        </div>

        <div className="form-group">
          <label>Second Name</label>
          <input type="text" placeholder="Enter second name" />
        </div>

        <div className="form-group">
          <label>Age</label>
          <input type="number" placeholder="Enter age" />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select>
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Enter email" />
        </div>

        <div className="form-group">
          <label>School Name</label>
          <input type="text" placeholder="Enter school name" />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input type="text" placeholder="Enter address" />
        </div>

        <div className="form-group">
          <label>City</label>
          <input type="text" placeholder="Enter city" />
        </div>

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default UserForm;
