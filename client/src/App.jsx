import '@/App.css'
import Layout from '@/components/Layout/Layout';
import { Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* <Route path="/" element={<Home />} /> */}
          {/*  <Route path="/posts" element={<Home />} /> */}
          {/* <Route path="/about" element={<AboutMe />} /> */}
          {/* <Route path="/post/:id" element={<Post />} /> */}
          {/* <Route path="/new_post" element={<NewPost />} /> */}
          {/* <Route path="/update_post/:id" element={<NewPost />} /> */}
          {/* <Route path="*" element={<Error404 />} /> */}
        </Route>
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
      </Routes>
    </>
  )
}

export default App
