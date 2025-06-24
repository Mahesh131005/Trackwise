import React,{useState} from "react"
import { AppSidebar } from './app-sidebar.jsx';
import Tables from './tables.jsx';
import { Popover1 } from './popover.jsx';

function App() {
   const [entries, setEntries] = useState([]);

  const addEntry = (entry) => {
    setEntries((prev) => [...prev, entry]);
  };
  const onDelete=(idx)=>{
    setEntries(prevEntries => prevEntries.filter((_, i) => i !== idx));
  }
  const onClear=()=>{
    setEntries([]);
  }
  return (
       <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 p-4 gap-2">
        <Popover1 addEntry={addEntry} onClear={onClear}/>
        <Tables entries={entries} onDelete={onDelete}/>
      </main>
    </div>
  )
}

export default App;
