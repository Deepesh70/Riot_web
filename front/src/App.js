import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar';

function App() {
  return (
    <div className='min-h-screen bg-black text-white'>
      <Navbar />
      <div className="p-8">
        <h1 className="text-4xl font-bold text-center mt-10">Welcome to the Rift</h1>
      </div>
    </div>
  );
}

export default App
