import { useState } from "react";
import BoardList from "./components/BoardList";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Write from "./components/Write";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <h1>React BBS</h1>
      <BoardList />
      <hr />
      <Write />
    </div>
  );
}

export default App;
