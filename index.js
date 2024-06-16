const express = require("express");
require("express-group-routes");
const cors = require("cors");

require("dotenv").config({ path: "config/.env" });

const LoginController = require("./controller/login");
const cardController = require("./controller/card");

const { AuthMiddleware } = require("./middleware/verify-token");

const app = express();
app.use(cors());

app.use((req, res, next) => {
  //doesn't send response just adjusts it
  res.header("Access-Control-Allow-Origin", "*"); //* to give access to any origin
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization" //to give access to all the headers provided
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET"); //to give access to all the methods provided
    return res.status(200).json({});
  }
  next(); //so that other routes can take over
});

app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({limit: '50mb'}));

app.get("/", (req, res) => {
  res.json({ success: "true" });
});

app.post("/api/admin-login", LoginController.adminVerify);
app.post("/api/login", LoginController.verify);

app.get("/api/card/:id", cardController.getById);

app.post("/submit-contact", cardController.submitContact);
app.get("/my-contacts", cardController.getContacts);

app.group("/api/auth", (router) => {
  router.use(AuthMiddleware);

  router.get("/cards", cardController.get);
  router.post("/cards/create", cardController.create);

  router.put("/card/update", cardController.updatecard);

  router.post("/card/update-status", cardController.updateStatus);
  router.post("/card/disable", cardController.disableCard);

  router.get("/card/:id", cardController.getByIdAndVerify);

  router.post("/subaccount/create", LoginController.createAccount);
  router.post("/subaccount/delete", LoginController.deleteAccount);
  router.get("/subaccounts", LoginController.getSubaccounts);

  router.get("/subaccounts", LoginController.getSubaccounts);
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Backend Started at Port ${process.env.SERVER_PORT}`);
});
// source /home/hdvq7976/nodevenv/backend.wefast.fr/18/bin/activate && cd /home/hdvq7976/backend.wefast.fr
