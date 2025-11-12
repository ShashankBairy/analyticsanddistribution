import './App.css';
import ApplicationTab from './components/ApplicationComponents/ApplicationTab';
import Sidebar from './components/Sidebar';

import { Route, Routes } from 'react-router-dom';

const Student = () => <div>Student</div>
const Dashboard = () => <div>Dasboard</div>
const Students = () => <div>Students</div>
const Employee = () => <div>Employee</div>
const Fleet = () => <div>Fleet</div>
const Warehouse = () => <div>Worehouse</div>
const Sms = () => <div>SMS</div>
const QuestionBank = () => <div>Question Bank</div>
const AssetsManagement = () => <div>Assets Management</div>
const PaymentsService = () => <div>Payment Services</div>
const Cctv = () => <div>CCTV</div>
const Hrms = () => <div>HRMS</div>
const Masters = () => <div>Masters</div>

function App() {
  return (
      <div className='scopes_app'>
        <header></header>
        <aside>
          <Sidebar/>
        </aside>
        <main>
           <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/students" element={<Students />} />
                <Route path="/application/*" element={<ApplicationTab />} />
                <Route path="/employee" element={<Employee />} />
                <Route path="/fleet" element={<Fleet />} />
                <Route path="/warehouse" element={<Warehouse />} />
                <Route path="/sms" element={<Sms />} />
                <Route path="/question-bank" element={<QuestionBank />} />
                <Route path="/assets-management" element={<AssetsManagement />} />
                <Route path="/payments-service" element={<PaymentsService />} />
                <Route path="/cctv" element={<Cctv />} />
                <Route path="/hrms" element={<Hrms />} />
                <Route path="/masters" element={<Masters />} />
           </Routes>
        </main>
      </div>
  );
}

export default App;
