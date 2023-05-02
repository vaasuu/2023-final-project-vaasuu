const Acknowledgements = () => {
  document.title = "Acknowledgements | Marketplace";

  return (
    <div className="container">
      <h1>Acknowledgements</h1>
      <p>
        <a href="https://www.svgrepo.com/svg/511129/shopping-cart-01">
          Shopping cart icon{" "}
        </a>
        used in the favicon is by{" "}
        <a href="https://www.svgrepo.com/author/krystonschwarze/">
          krystonschwarze
        </a>
        {", "}
        used under the{" "}
        <a href="https://www.svgrepo.com/page/licensing#CC%20Attribution">
          Creative Commons Attribution lisense
        </a>
        .
      </p>
      <p>
        Robohash user profile images are from robohash.org and are licensed
        under the CC-BY license.
      </p>
    </div>
  );
};

export default Acknowledgements;
