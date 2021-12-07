import {Routes, Route, Navigate} from 'react-router-dom'
import CreateProject from './component/CreateProject'
import LabelImages from './component/LabelImages';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/create-project" />} />
      <Route path="/create-project" element={<CreateProject />} />
      <Route path="/label-images" element={< LabelImages />} />
    </Routes>
  );
}

export default App;
