import './App.css';
import Stock from './components/Stock';
import TestChart from './components/testChart';

function App() {
  return (
    <div className="App">
      <Stock title='Apple Inc' ticker='AAPL' />
      <Stock title='Microsoft' ticker='MSFT' />
      <TestChart />
    </div>
  );
}

export default App;
