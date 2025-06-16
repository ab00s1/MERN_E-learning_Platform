import './Admin.css';
import { useAdmin } from '../../context/AdminContext';
import { useUser } from '../../context/UserContext';
import { useState } from 'react';
import Loading from '../../components/Loading/Loading';
import { useNavigate } from 'react-router-dom';

const initialState = {
  title: '',
  description: '',
  image: null,
  duration: '',
  price: '',
  category: '',
};

const AddCourse = () => {
  const { createCourse } = useAdmin();
  const { user } = useUser();
  const [form, setForm] = useState(initialState);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.title || !form.description || !form.image || !form.duration || !form.price || !form.category) {
      setError('All fields are required.');
      return;
    }
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('file', form.image);
    formData.append('duration', form.duration);
    formData.append('price', form.price);
    formData.append('category', form.category);
    formData.append('createdBy', user?.name || 'Admin');
    const result = await createCourse(formData, setLoading, setError);
    if (result && result.course) {
      setSuccess('Course created successfully!');
      setForm(initialState);
      setPreview(null);
      setTimeout(() => navigate('/courses'), 1200);
    }
  };

  return (
    <div className="add-course-admin-container">
      <h1 className="add-course-admin-title">Add New Course</h1>
      <form className="add-course-admin-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="add-course-admin-row">
          <label>Title<span>*</span></label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="add-course-admin-row">
          <label>Description<span>*</span></label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={3} />
        </div>
        <div className="add-course-admin-row">
          <label>Image<span>*</span></label>
          <input type="file" accept="image/*" onChange={handleImageChange} required />
          {preview && <img src={preview} alt="Preview" className="add-course-admin-image-preview" />}
        </div>
        <div className="add-course-admin-row">
          <label>Duration (weeks)<span>*</span></label>
          <input type="number" name="duration" value={form.duration} onChange={handleChange} min={1} required />
        </div>
        <div className="add-course-admin-row">
          <label>Price ($)<span>*</span></label>
          <input type="number" name="price" value={form.price} onChange={handleChange} min={0} required />
        </div>
        <div className="add-course-admin-row">
          <label>Category<span>*</span></label>
          <input type="text" name="category" value={form.category} onChange={handleChange} required />
        </div>
        <div className="add-course-admin-row">
          <label>Created By</label>
          <input type="text" name="createdBy" value={user?.name || 'Admin'} disabled />
        </div>
        {error && <div className="add-course-admin-error">{error}</div>}
        {success && <div className="add-course-admin-success">{success}</div>}
        <button className="add-course-admin-btn" type="submit" disabled={loading}>{loading ? <Loading small /> : 'Add Course'}</button>
      </form>
    </div>
  );
};

export default AddCourse;
