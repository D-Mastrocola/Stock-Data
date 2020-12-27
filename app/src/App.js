import './App.css';
import Stock from './components/Stock';

function App() {
  return (
    <div className="App">
      <Stock title='Apple Inc' ticker='AAPL' />
      <Stock title='Microsoft' ticker='MSFT' />
    </div>
  );
}

export default App;
