const app = require("./app");

require("dotenv").config(); // loads .env file into process.env

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
