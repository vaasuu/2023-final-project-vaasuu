import notFoundIllustration from "../../../assets/notFoundPage/undraw_not_found_re_bh2e.svg";

import "./NotFound.css";

const NotFound = () => {
  document.title = "Page Not Found | Marketplace";

  return (
    <div className="container">
      <h1>Unfortunatly the page you are looking for does not exist.</h1>

      <img className="notFound-illustration" src={notFoundIllustration} />
    </div>
  );
};

export default NotFound;
