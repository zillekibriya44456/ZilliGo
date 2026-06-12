import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { BookOpen, GraduationCap, PlayCircle, Clock, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Academy() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getCourses()
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await api.enrollInCourse(courseId);
      navigate(`/academy/course/${courseId}`);
    } catch (err) {
      alert('Error enrolling in course.');
    }
  };

  if (loading) return <div className="page-wrapper" style={{display:'flex', alignItems:'center', justifyContent:'center'}}><div className="spinner" /></div>;

  return (
    <div className="page-wrapper" style={{ padding: '2rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem', padding: '4rem 2rem', background: 'linear-gradient(135deg, rgba(29, 78, 216, 0.2), rgba(15, 23, 42, 0.8))', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.1 }}>
          <GraduationCap size={400} />
        </div>
        <h1 style={{ margin: '0 0 1rem 0', fontSize: '3rem', position: 'relative', zIndex: 1 }}>ZilliGo Academy</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          Master new languages, learn cultural etiquette, and earn recognized digital certificates before your next adventure.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
        {courses.map(course => (
          <div key={course.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'transform 0.3s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ position: 'relative', height: '200px' }}>
              <img src={course.coverImage} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(0,0,0,0.6)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', color: 'white', fontWeight: 'bold' }}>
                {course.category}
              </div>
            </div>
            
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><BookOpen size={14} /> {course.level}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Award size={14} /> Certificate</span>
              </div>
              
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem' }}>{course.title}</h3>
              <p style={{ color: 'var(--accent-teal)', fontSize: '0.9rem', marginBottom: '1rem' }}>By {course.authorName || 'ZilliGo Instructors'}</p>
              
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1, lineHeight: '1.5' }}>
                {course.description}
              </p>
              
              <button className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem' }} onClick={() => handleEnroll(course.id)}>
                <PlayCircle size={18} /> Enroll Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
