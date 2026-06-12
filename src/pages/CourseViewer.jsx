import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { PlayCircle, CheckCircle, ArrowRight, Award, ChevronLeft } from 'lucide-react';
import Confetti from 'react-confetti';

export default function CourseViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Progress state
  const [completedLessons, setCompletedLessons] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizStatus, setQuizStatus] = useState(null); // 'correct', 'incorrect', null
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    api.getCourseLessons(id)
      .then(data => {
        setLessons(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const activeLesson = lessons[activeLessonIndex];

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
    if (index === activeLesson.quizData.correctIndex) {
      setQuizStatus('correct');
      // Mark lesson complete
      const newCompleted = { ...completedLessons, [activeLesson.id]: true };
      setCompletedLessons(newCompleted);
      
      const isCourseDone = Object.keys(newCompleted).length === lessons.length;
      if (isCourseDone) {
        setCourseCompleted(true);
        setShowConfetti(true);
      }
      
      api.updateCourseProgress({
        courseId: parseInt(id),
        lessonId: activeLesson.id,
        completed: isCourseDone
      }).catch(console.error);

    } else {
      setQuizStatus('incorrect');
    }
  };

  const nextLesson = () => {
    if (activeLessonIndex < lessons.length - 1) {
      setActiveLessonIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setQuizStatus(null);
    }
  };

  if (loading) return <div className="page-wrapper" style={{display:'flex', alignItems:'center', justifyContent:'center'}}><div className="spinner" /></div>;
  if (lessons.length === 0) return <div className="page-wrapper" style={{padding:'2rem'}}>No lessons found for this course.</div>;

  return (
    <div className="page-wrapper" style={{ display: 'flex', height: 'calc(100vh - 70px)' }}>
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      {/* Sidebar Navigation */}
      <aside className="glass-card" style={{ width: '300px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', borderRadius: 0 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem' }} onClick={() => navigate('/academy')}>
            <ChevronLeft size={16} /> Back to Academy
          </button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, padding: '1rem 0' }}>
          {lessons.map((lesson, idx) => {
            const isCompleted = completedLessons[lesson.id];
            const isActive = idx === activeLessonIndex;
            return (
              <div 
                key={lesson.id}
                onClick={() => { setActiveLessonIndex(idx); setSelectedAnswer(null); setQuizStatus(null); }}
                style={{ 
                  padding: '1rem 1.5rem', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                  borderLeft: isActive ? '4px solid var(--accent-teal)' : '4px solid transparent',
                  transition: 'background 0.2s'
                }}
              >
                {isCompleted ? <CheckCircle size={20} color="var(--accent-teal)" /> : <PlayCircle size={20} color="var(--text-muted)" />}
                <span style={{ color: isActive ? 'white' : 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: isActive ? 'bold' : 'normal' }}>
                  {lesson.title}
                </span>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '900px' }}>
          <h1 style={{ marginBottom: '1.5rem' }}>{activeLesson.title}</h1>
          
          {/* Video Player */}
          {activeLesson.videoUrl && (
            <div style={{ background: 'black', borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/9', marginBottom: '2rem' }}>
              <video src={activeLesson.videoUrl} controls style={{ width: '100%', height: '100%' }} />
            </div>
          )}

          {/* Lesson Content */}
          <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
            {activeLesson.content}
          </div>

          {/* Interactive Quiz */}
          {activeLesson.quizData && (
            <div className="glass-card" style={{ padding: '2rem', border: quizStatus === 'correct' ? '1px solid var(--accent-teal)' : quizStatus === 'incorrect' ? '1px solid var(--accent-rose)' : '1px solid var(--border-color)' }}>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Knowledge Check
              </h3>
              <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>{activeLesson.quizData.question}</p>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                {activeLesson.quizData.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  let bg = 'var(--bg-elevated)';
                  if (isSelected && quizStatus === 'correct') bg = 'rgba(16, 185, 129, 0.2)'; // teal
                  if (isSelected && quizStatus === 'incorrect') bg = 'rgba(239, 68, 68, 0.2)'; // rose
                  
                  return (
                    <button 
                      key={idx}
                      onClick={() => handleAnswerSelect(idx)}
                      disabled={quizStatus === 'correct'} // lock if already answered correctly
                      style={{ 
                        padding: '1rem', 
                        borderRadius: '8px', 
                        border: '1px solid var(--border-color)', 
                        background: bg,
                        color: 'white',
                        textAlign: 'left',
                        cursor: quizStatus === 'correct' ? 'default' : 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {quizStatus === 'correct' && (
                <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                    <CheckCircle /> Correct! You've mastered this lesson.
                  </span>
                  
                  {activeLessonIndex < lessons.length - 1 ? (
                    <button className="btn btn-primary" onClick={nextLesson} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      Next Lesson <ArrowRight size={16} />
                    </button>
                  ) : (
                    <span style={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Award color="var(--accent-amber)" /> Course Completed!
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Completion State */}
          {courseCompleted && activeLessonIndex === lessons.length - 1 && (
            <div className="glass-card" style={{ padding: '3rem', marginTop: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(29, 78, 216, 0.2), rgba(16, 185, 129, 0.2))' }}>
              <Award size={64} color="var(--accent-amber)" style={{ marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Congratulations!</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                You have successfully completed this course. A "Certified Learner" stamp has been permanently added to your Digital Passport.
              </p>
              <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                View My Passport
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
