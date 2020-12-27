import './App.css';
import Stock from './components/Stock';

function App() {
  return (
    <div className="App">
      <Stock title='Apple Inc' ticker='AAPL' />
      <Stock/>
    </div>
  );
}

export default App;
