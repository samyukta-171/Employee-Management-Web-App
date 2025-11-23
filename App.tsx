import { useState } from 'react';
import { Users, FileText } from 'lucide-react';
import EmployeeForm from './components/EmployeeForm';
import EmployeeReport from './components/EmployeeReport';

type View = 'form' | 'report';

function App() {
  const [currentView, setCurrentView] = useState<View>('form');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            Employee Management System
          </h1>
          <p className="text-gray-600 text-lg">Comprehensive employee data management solution</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setCurrentView('form')}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all transform hover:-translate-y-0.5 shadow-lg ${
              currentView === 'form'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-300'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <Users className="w-5 h-5" />
            Add Employee
          </button>
          <button
            onClick={() => setCurrentView('report')}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all transform hover:-translate-y-0.5 shadow-lg ${
              currentView === 'report'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-emerald-300'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <FileText className="w-5 h-5" />
            View Report
          </button>
        </div>

        <div className="animate-fadeIn">
          {currentView === 'form' ? (
            <EmployeeForm onSuccess={() => setCurrentView('report')} />
          ) : (
            <EmployeeReport />
          )}
        </div>
      </div>

      <footer className="text-center py-6 text-gray-600 text-sm mt-12">
        <p>© 2025 Employee Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
