import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useAuth } from './context/AuthContext';
import { useCollection } from './hooks/useCollection';
import { useTheme } from './hooks/useTheme';
import { signOut } from 'firebase/auth';
import { auth } from './firebase/config';

import Header from './components/Header';
import OnboardingModal from './components/OnboardingModal';
import LoginScreen from './views/auth/LoginScreen';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load the main dashboard components for better performance
const UserDashboard = lazy(() => import('./views/user/UserDashboard'));
const AdminDashboard = lazy(() => import('./views/admin/AdminDashboard'));
const QuestionView = lazy(() => import('./views/user/QuestionView'));

function App() {
    const { userData, loading } = useAuth();
    const [currentView, setCurrentView] = useState('dashboard');
    const [takingCourseId, setTakingCourseId] = useState(null);
    const [theme, setTheme] = useTheme();
    const [showOnboarding, setShowOnboarding] = useState(false);
    
    // We still need to fetch courses at the top level to pass to the QuestionView
    const { data: courses, loading: coursesLoading } = useCollection('courses');

    useEffect(() => {
        if (!loading && userData) {
             if (!sessionStorage.getItem('hasSeenTour')) {
                setShowOnboarding(true);
                sessionStorage.setItem('hasSeenTour', 'true');
            }
        }
    }, [userData, loading]);
    
    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
    
    const handleStartCourse = (courseId) => setTakingCourseId(courseId);
    const handleExitCourse = () => setTakingCourseId(null);
    
    const handleLogout = async () => {
        handleExitCourse();
        setCurrentView('dashboard');
        await signOut(auth);
    };

    useEffect(() => { 
        if (userData) { 
            setCurrentView('dashboard'); 
            handleExitCourse();
        } 
    }, [userData]);

    if (loading || coursesLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100">
                Loading Application...
            </div>
        );
    }

    if (!userData) {
        return (
             <div className={theme}>
                <div className="bg-neutral-100 dark:bg-neutral-900">
                    <LoginScreen />
                </div>
            </div>
        );
    }
    
    const courseBeingTaken = takingCourseId ? courses.find(c => c.id === takingCourseId) : null;

    const renderCurrentView = () => {
        if (courseBeingTaken) {
            return <QuestionView course={courseBeingTaken} user={userData} onBack={handleExitCourse} />;
        }
        if (userData.isAdmin && currentView === 'admin') {
            return <AdminDashboard />;
        }
        return <UserDashboard user={userData} onStartCourse={handleStartCourse} />;
    };

    return ( 
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors">
            {showOnboarding && <OnboardingModal user={userData} onClose={() => setShowOnboarding(false)} />}
            <div className={showOnboarding ? 'blur-sm' : ''}>
                <Header 
                    user={userData} 
                    onLogout={handleLogout} 
                    onSwitchView={setCurrentView} 
                    theme={theme} 
                    toggleTheme={toggleTheme} 
                    currentView={currentView} 
                    onShowTour={() => setShowOnboarding(true)} 
                />
                <main>
                    <ErrorBoundary>
                        <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                            {renderCurrentView()}
                        </Suspense>
                    </ErrorBoundary>
                </main>
            </div>
        </div> 
    );
};

export default App;

