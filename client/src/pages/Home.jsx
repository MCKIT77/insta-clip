import Upload from "../components/Upload";
import Videos from "../components/Videos"
import Auth from "../utils/auth";
import { Navigate } from "react-router-dom";

const Home = () => {
  if (Auth.loggedIn()){
    return (
      <div className="container">
        <Upload />
        <Videos />
      </div>
    );
  } else {
    return (
      <Navigate replace to="/login" />
    )
  }
};

export default Home;