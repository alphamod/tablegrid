import React, {useState} from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Table from './components/Table'

function App() {
  // state hook for storing JSON data from API endpoint
  // const [apiData, setApiData] = useState("");
  const [cCode, setcCode] = useState("US");
  const [schedDate, setschedDate] = useState("2014-01-01");
  const [layoutVar, setLayoutVar] = useState("false");


  // prop function to save API params 
  let saveApiParams = (schedDate, cCode) => {
    setschedDate(schedDate);
    setcCode(cCode);
  }
// toggle layout var
  const toggleBt = event => {
    if (layoutVar === "false") {
      setLayoutVar("true");
    } else if (layoutVar === "true") {
      setLayoutVar("false");
    }
}  

  return (
    <div className="App">
      <Sidebar></Sidebar>
      {/* sending function as props to fetch data with API params */}
      <Navbar saveApiParams={saveApiParams}></Navbar>
      <div className="viewCont">
        <div className="d-flex">
          <h5 className="text-dark">TV Show List</h5>
                    <button onClick={toggleBt} className="btn btn-warning text-dark border-danger ml-auto">Filter</button>
            </div>
            <div className="container-fluid p-0">
                <Table cCode={cCode} layoutVar={layoutVar} schedDate={schedDate}></Table>
            </div>
        </div>

    </div>
  );
}

export default App;
