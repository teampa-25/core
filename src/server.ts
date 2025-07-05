import app from "./app";
import config from "./config/config";

const message = "hello world";

function greet(name: string) {
  console.log("Hi " + name);
  console.log(message);
}

greet("Bro");

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
