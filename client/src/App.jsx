import { Route, Routes } from "react-router-dom";
import '@/App.css'
import { Layout } from '@/components/Layout/layout';

const App = () => {
  return (
    <>
      <h1>El mundo de Jonathan</h1>
      <h4>Entorno de desarrollo</h4>
      <Routes>
        <Route path="/" element={<Layout />}></Route>
      </Routes>
    </>
  )
}

export default App
