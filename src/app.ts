import express from "express";
import * as bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import { getImages } from "./features/getImages/getImages";

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.disable("x-powered-by");

app.post("/gallery", getImages);

const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log("server listening on port :9000");
});
