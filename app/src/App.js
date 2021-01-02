import './App.css';
import Stock from './components/Stock';
function App() {
  return (
    <div className="App">
      <Stock title='First Solar' ticker='FSLR' />
      <Stock title='Apple' ticker='AAPL' />
      <Stock title='Microsoft' ticker='MSFT' />
      <Stock title='Tesla' ticker='TSLA' />
      
    </div>
  );
}

export default App;
