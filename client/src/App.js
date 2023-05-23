import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav/Nav'
import LoginForm from './components/LoginForm.js/LoginForm';
import Home from './components/Home/Home';
import SingleList from './components/SingleList/SingleList';
import NewList from './components/NewList/NewList';

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route
          path='/home/:userId'
          element={<Home />}
        />
        <Route
          path='/login'
          element={<LoginForm />}
        />
        <Route
          path='/:userId/list/:listId'
          element={<SingleList />}
        />
        <Route
          path='/:userId/newList'
          element={<NewList />}
        />
      </Routes>

    </Router>


  );
}

export default App;
