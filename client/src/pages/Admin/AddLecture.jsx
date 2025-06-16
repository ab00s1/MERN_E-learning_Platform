import './Admin.css';
import { useAdmin } from '../../context/AdminContext';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading/Loading';

const initialState = {
  title: '',
  description: '',
  video: null,
};

const AddLecture = () => {
  const { addLectures } = useAdmin();
  const { CourseId: courseId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, video: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.title || !form.description || !form.video) {
      setError('All fields are required.');
      return;
    }
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('file', form.video);
    const result = await addLectures(courseId, formData, setLoading, setError);
    if (result && result.lecture) {
      setSuccess('Lecture added successfully!');
      setForm(initialState);
      setPreview(null);
      setTimeout(() => navigate(`/courses/${courseId}/lectures`), 1200);
    }
  };

  return (
    <div className="add-lecture-admin-container">
      <h1 className="add-lecture-admin-title">Add New Lecture</h1>
      <form className="add-lecture-admin-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="add-lecture-admin-row">
          <label>Title<span>*</span></label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="add-lecture-admin-row">
          <label>Description<span>*</span></label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={3} />
        </div>
        <div className="add-lecture-admin-row">
          <label>Video<span>*</span></label>
          <input type="file" accept="video/*" onChange={handleVideoChange} required />
          {preview && <video src={preview} controls className="add-lecture-admin-video-preview" />}
        </div>
        {error && <div className="add-lecture-admin-error">{error}</div>}
        {success && <div className="add-lecture-admin-success">{success}</div>}
        <button className="add-lecture-admin-btn" type="submit" disabled={loading}>{loading ? <Loading small /> : 'Add Lecture'}</button>
      </form>
    </div>
  );
};

export default AddLecture;
