import Auth from "../../utils/auth";
import { Link } from "react-router-dom";
import logo from "../../images/logo.png"

function Nav() {

  function showNavigation() {
    if (Auth.loggedIn()) {
      return (
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <Link to="/" class="nav-link active" aria-current="page">
                Home
              </Link>
            </li>
            <li class="nav-item">
              <a href="/" class="nav-link active" onClick={() => Auth.logout()}>
                Logout
              </a>
            </li>
          </ul>
        </div>
      );
    } else {
      return (
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <Link to="/signup" class="nav-link active" aria-current="page">
                Signup
              </Link>
            </li>
            <li class="nav-item">
              <Link to="/login" class="nav-link">
                Login
              </Link>
            </li>
          </ul>
        </div>
      );
    }
  }

  return (
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <Link to="/" class="navbar-brand">
            <img src={logo} alt="logo" className="navbar-logo" />
            InstaClip
          </Link>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          {showNavigation()}
        </div>
      </nav>
  );
}

export default Nav;
