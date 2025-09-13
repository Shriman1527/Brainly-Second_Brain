import './App.css'
import Dashboard from "./pages/Dashboard";


import { SignUp } from "./pages/Signup";
import { SignIn } from "./pages/Signin";
import { BrowserRouter, Routes,Route } from "react-router-dom";





function App(){

  return <BrowserRouter>

      <Routes>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/signin' element={<SignIn/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          //Here we have to handle the route regarding the 
          // when we share our brain . then link should be display UI
          
      </Routes>
  </BrowserRouter>
}

export default App;


// completed till 2.32.00
//from now onwards we are connecting the frontend to the backend

//Liabraries used for data fetching =>
// react-hook-forms
// react-query
// swr

// This above are used when we want to connect
// Frontend with the backend

// Today we are not using it but this are nowdays used 
// We are doing it with by using first principle


//completed till 3.4.00 
//now we are trying to get the cards from backend 
// we added the content add functionality






