import { useState, useEffect } from 'react';
import { FileText, Download, Search, IndianRupee, Mail, Phone, Building2, Briefcase, Calendar, Trash2, RefreshCw } from 'lucide-react';
import { supabase, Employee } from '../lib/supabase';

export default function EmployeeReport() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
      setFilteredEmployees(data || []);
    } catch (error: any) {
      alert(`Error fetching employees: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const filtered = employees.filter(emp =>
      emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Employee deleted successfully!');
      fetchEmployees();
    } catch (error: any) {
      alert(`Error deleting employee: ${error.message}`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const exportToCSV = () => {
    const headers = ['Employee ID', 'Full Name', 'Email', 'Phone', 'Department', 'Position', 'Salary (₹)', 'Date of Joining', 'Status'];
    const csvData = filteredEmployees.map(emp => [
      emp.employee_id,
      emp.full_name,
      emp.email,
      emp.phone,
      emp.department,
      emp.position,
      emp.salary,
      emp.date_of_joining,
      emp.status
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const totalSalary = filteredEmployees.reduce((sum, emp) => sum + emp.salary, 0);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading employee data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Employee Report</h2>
                <p className="text-emerald-100 mt-1">Complete employee database overview</p>
              </div>
            </div>
            <button
              onClick={fetchEmployees}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 backdrop-blur-sm transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
              <p className="text-sm font-semibold text-blue-700 mb-1">Total Employees</p>
              <p className="text-3xl font-bold text-blue-900">{filteredEmployees.length}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border-2 border-emerald-200">
              <p className="text-sm font-semibold text-emerald-700 mb-1">Total Monthly Payroll</p>
              <p className="text-3xl font-bold text-emerald-900">{formatCurrency(totalSalary)}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border-2 border-amber-200">
              <p className="text-sm font-semibold text-amber-700 mb-1">Active Employees</p>
              <p className="text-3xl font-bold text-amber-900">
                {filteredEmployees.filter(e => e.status === 'Active').length}
              </p>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, ID, department, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
              />
            </div>
            <button
              onClick={exportToCSV}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>

          {filteredEmployees.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-600">No employees found</p>
              <p className="text-gray-500 mt-2">Try adjusting your search or add new employees</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all hover:border-emerald-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-800">{employee.full_name}</h3>
                        <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
                          {employee.employee_id}
                        </span>
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                          employee.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {employee.status}
                        </span>
                      </div>
                      <p className="text-gray-600 font-medium">{employee.position}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(employee.id!)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 p-3 rounded-lg transition-all"
                      title="Delete Employee"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">Email</p>
                        <p className="text-sm text-gray-800 font-medium">{employee.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 p-2 rounded-lg">
                        <Phone className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">Phone</p>
                        <p className="text-sm text-gray-800 font-medium">{employee.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Building2 className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">Department</p>
                        <p className="text-sm text-gray-800 font-medium">{employee.department}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <Briefcase className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">Position</p>
                        <p className="text-sm text-gray-800 font-medium">{employee.position}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <IndianRupee className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">Monthly Salary</p>
                        <p className="text-sm text-gray-800 font-bold">{formatCurrency(employee.salary)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-pink-100 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">Joined On</p>
                        <p className="text-sm text-gray-800 font-medium">{formatDate(employee.date_of_joining)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
