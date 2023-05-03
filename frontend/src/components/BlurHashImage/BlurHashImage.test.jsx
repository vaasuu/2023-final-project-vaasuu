import { render, screen } from "@testing-library/react";

import BlurHashImage from "./BlurHashImage";
import { describe, expect, it } from "vitest";

describe("BlurHashImage", () => {
  it("renders image with blurhash", () => {
    const blurhash = "L6B|HM0J00tS00-;-;RP00-;~qMx";
    const url =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Hauskatze_langhaar.jpg/320px-Hauskatze_langhaar.jpg";
    const alt = "Example cat image";
    render(<BlurHashImage url={url} alt={alt} blurhash={blurhash} />);

    const image = screen.getByRole("img", { name: alt });
    expect(image).toHaveAttribute("src", url);
    expect(image).toHaveAttribute("alt", alt);

    const blurhashDiv = screen.getByRole("img", { name: alt }).parentElement
      .firstChild;
    expect(blurhashDiv.firstChild).toBeInstanceOf(HTMLCanvasElement);
  });

  it("renders image without blurhash", () => {
    const url =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Hauskatze_langhaar.jpg/320px-Hauskatze_langhaar.jpg";
    const alt = "Example cat image";
    render(<BlurHashImage url={url} alt={alt} />);

    const image = screen.getByRole("img", { name: alt });
    expect(image).toHaveAttribute("src", url);
    expect(image).toHaveAttribute("alt", alt);
  });
});
