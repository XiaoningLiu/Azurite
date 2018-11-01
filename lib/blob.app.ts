import express from "express";

const app = express();

app.all("/", (_req, res) => {
  res.send("Hello World");
});

export default app;
