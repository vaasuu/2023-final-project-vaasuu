import { describe, expect, it } from "vitest";
import { parseJwt } from "./utils";

describe("parseJwt", () => {
  it("should return the payload when a valid JWT is provided", () => {
    // Arrange
    const jwt =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    // Act
    const result = parseJwt(jwt);

    // Assert
    expect(result).toEqual({
      sub: "1234567890",
      name: "John Doe",
      iat: 1516239022,
    });
  });

  it("should return null when an invalid JWT is provided", () => {
    // Arrange
    const jwt = "not_a_valid_jwt";

    // Act
    const result = parseJwt(jwt);

    // Assert
    expect(result).toBeNull();
  });
});
