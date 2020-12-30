import './App.css';
import Stock from './components/Stock';
import TestChart from './components/testChart';

function App() {
  return (
    <div className="App">
      <Stock title='Microsoft' ticker='MSFT' />
      <TestChart title='Apple Inc' ticker='AAPL'/>
    </div>
  );
}

export default App;
