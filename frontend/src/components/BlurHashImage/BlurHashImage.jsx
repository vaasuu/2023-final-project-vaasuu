import { useState } from "react";
import { Blurhash } from "react-blurhash";

function BlurHashImage(props) {
  const { url, alt, blurhash, ...rest } = props;
  const [imageLoaded, setImageLoaded] = useState(false);

  function handleImageLoad() {
    setImageLoaded(true);
  }

  return (
    <div style={{ position: "absolute", width: "100%", height: "100%" }}>
      {!imageLoaded && blurhash && (
        <Blurhash
          className="blurhash"
          hash={blurhash}
          width="100%"
          height="100%"
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      )}
      <img src={url} alt={alt} onLoad={handleImageLoad} {...rest} />
    </div>
  );
}

export default BlurHashImage;
