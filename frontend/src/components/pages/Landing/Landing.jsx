import { Link } from "react-router-dom";
import illustration from "../../../assets/landingPage/undraw_empty_cart_co35.svg";
import "./Landing.css";

const topNavLinks = [
  { to: "/login", text: "Login" },
  { to: "/register", text: "Register" },
];

const bottomLinks = [
  { to: "/tos", text: "Terms of Service" },
  { to: "/privacy", text: "Privacy Policy" },
  { to: "/acknowledgements", text: "Acknowledgements" },
];

const Landing = () => {
  return (
    <div className="landing">
      <header className="landing-header">
        <nav className="landing-nav">
          {topNavLinks.map(({ to, text }) => (
            <Link key={to} to={to}>
              {text}
            </Link>
          ))}
        </nav>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <h1>Welcome to our Marketplace</h1>
          <p>Find the best products from top sellers around the world</p>
          <Link to="/listings" className="btn-primary">
            Explore listings now
          </Link>
        </section>
        <section className="landing-features">
          <h2>Features</h2>
          <ul>
            <li>Post listings</li>
            <li>Search listings</li>
            <li>View listings</li>
            <li>View user profiles</li>
            <li>View user listings</li>
            <li>and more...</li>
          </ul>
        </section>
        <section className="landing-illustration">
          <img
            className="landing-features-illustration"
            src={illustration}
            alt="Illustration of an empty shopping cart"
          />
        </section>
      </main>

      <footer className="landing-footer">
        <nav className="landing-footer-nav">
          {bottomLinks.map(({ to, text }) => (
            <Link key={to} to={to}>
              {text}
            </Link>
          ))}
        </nav>
        <p className="landing-copyright">
          &copy; {new Date().getFullYear()} Marketplace site.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
