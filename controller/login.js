const BCRYPT = require("bcryptjs");

const JWT = require("jsonwebtoken");

const Pool = require("../config/db");

const currentTime = () => {
  return new Date();
};

const verify = async (req, res) => {
  try {
    const { email, orderno } = req.body;
    let userDetails = await Pool.query(
      `select * from wpq7oe_wc_customer_lookup where email = '${email}';`
    );
    if (userDetails.length > 0) {
      userDetails = userDetails[0];

      console.log(userDetails.customer_id, orderno);
      let orderDetails = await Pool.query(
        `select * from wpq7oe_wc_order_stats where customer_id = '${
          userDetails.customer_id
        }' and order_id = '${parseInt(orderno)}';`
      );

      if (orderDetails.length > 0) {
        orderDetails = orderDetails[0];

        let offer = null;

        if (orderDetails.net_total > 0 && orderDetails.num_items_sold > 0) {
          price = orderDetails.net_total / orderDetails.num_items_sold;
          price = price.toFixed(2);

          offer = price == 9.99 ? 2 : price == 34.99 ? 1 : null;
        }

        const token = JWT.sign(
          {
            id: userDetails.customer_id,
            email: userDetails.email,
            role: "customer",
          },
          process.env.TOKEN_KEY,
          {
            algorithm: "HS256",
            expiresIn: "1d",
          }
        );

        return res.json({
          success: true,
          token: token,
          userDetails: {
            id: userDetails.customer_id,
            email: userDetails.email,
            role: "customer",
            offer: offer,
          },
        });
      } else {
        return res.json({
          success: false,
          error:
            "Le numéro de commande est incorrect ou cette commande ne vous appartient pas.",
        });
      }
    }
    return res.json({
      success: false,
      error: "Le client avec l'e-mail fourni n'existe pas.",
    });
  } catch (error) {
    console.log(`400 login(verify) | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};

const adminVerify = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email == process.env.ADMIN_EMAIL &&
      password == process.env.ADMIN_PASSWORD
    ) {
      const token = JWT.sign(
        {
          id: "",
          email: email,
          role: "admin",
        },
        process.env.TOKEN_KEY,
        {
          algorithm: "HS256",
          expiresIn: "1d",
        }
      );

      return res.json({
        success: true,
        token: token,
        userDetails: {
          id: null,
          email: email,
          role: "admin",
          offer: null,
        },
      });
    } else {
      let userDetails = await Pool.query(
        `select * from wpq7oe_vc_subaccounts where email = '${email}';`
      );
      if (userDetails.length > 0) {
        userDetails = userDetails[0];
        validPassword = await BCRYPT.compare(password, userDetails.password);
        if (validPassword) {
          const token = JWT.sign(
            {
              id: userDetails.id,
              email: userDetails.email,
              role: "subaccount",
              limit: userDetails.cards_limit,
            },
            process.env.TOKEN_KEY,
            {
              algorithm: "HS256",
              expiresIn: "1d",
            }
          );

          return res.json({
            success: true,
            token: token,
            userDetails: {
              id: userDetails.id,
              email: userDetails.email,
              role: "subaccount",
              offer: null,
              limit: userDetails.cards_limit,
            },
          });
        }
      }
    }
    return res.json({
      success: false,
      error: "Le compte avec l'e-mail ou le mot de passe fourni n'existe pas.",
    });
  } catch (error) {
    console.log(`400 login(verify) | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};

const createAccount = async (req, res) => {
  try {
    const { name, email, password, cards_limit } = req.body;
    const hashPassword = await BCRYPT.hash(password, 10);

    const user = await Pool.query(
      `INSERT INTO wpq7oe_vc_subaccounts (id,name,email,password,cards_limit,created_at,updated_at) VALUES (DEFAULT, '${name}', '${email}', '${hashPassword}', '${cards_limit}', ?,?);`,
      [currentTime(), currentTime()]
    );

    if (user.insertId) {
      return res.json({ success: true, user: user.insertId });
    }

    return res.json({
      success: false,
      error: "Un compte avec l'email fourni existe déjà.",
    });
  } catch (error) {
    console.log(`400 login(verify) | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};

const getSubaccounts = async (req, res) => {
  try {
    const query = `
        SELECT * from wpq7oe_vc_subaccounts;
    `;
    const result = await Pool.query(query);
    if (result) {
      return res.json({ success: true, subaccounts: result });
    }

    return res.json({
      success: false,
      error: "Erreur dans le serveur de base de données",
    });
  } catch (error) {
    console.log(`400 card(get) | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const query = `
        delete from wpq7oe_vc_subaccounts where id = '${req.body.id}';
    `;
    const result = await Pool.query(query);

    if (result.affectedRows) {
      return res.json({ success: true });
    } else {
      return res.json({
        success: false,
        error: "Aucun enregistrement trouvé.",
      });
    }
  } catch (error) {
    console.log(`400 login(deleteAccount) | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};

module.exports = {
  verify,
  adminVerify,
  createAccount,
  getSubaccounts,
  deleteAccount,
};
