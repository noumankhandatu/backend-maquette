const Pool = require("../config/db");

const currentTime = () => {
  return new Date();
};

const get = async (req, res) => {
  try {
    let and = ``;

    if (req.user.role == "customer" || req.user.role == "subaccount") {
      and = `where customer_id='${req.user.id}'`;
    }

    const query = `
        SELECT * from wpq7oe_vc_cards ${and};
    `;
    const result = await Pool.query(query);
    if (result) {
      return res.json({ success: true, cards: result });
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

const create = async (req, res) => {
  try {
    const {
      name,
      job,
      company,
      instagram,
      insta_pic,
      linkedin,
      linkedin_pic,
      facebook,
      facebook_pic,
      web_pic,
      web_url,
      email,
      email2,
      phone,
      telephone,
      address = "",
      addressLine1,
      addressLine2,
      city,
      country,
      zip,
      profile_pic,
      cover_pic,
      subscription,
      customer_id,
    } = req.body;

    if (req.user.role == "customer") {
      const query = `
        SELECT * from wpq7oe_vc_cards where customer_id='${req.user.id}';
      `;
      const result = await Pool.query(query);

      if (result.length) {
        return res.json({ success: false, error: "Limite atteinte" });
      }
    }

    if (req.user.role == "subaccount") {
      const query = `
        SELECT * from wpq7oe_vc_cards where customer_id='${req.user.id}';
      `;
      const result = await Pool.query(query);

      if (result.length >= req.user.limit) {
        return res.json({ success: false, error: "Limite atteinte" });
      }
    }

    const card = await Pool.query(
      `INSERT INTO wpq7oe_vc_cards (
        id,
        name,
        job,
        company,
        instagram,
        insta_pic,
        linkedin,
        linkedin_pic,
        facebook,
        facebook_pic,
        web_url,
        web_pic,
        email,
        email2,
        phone,
        telephone,
        address,
        addressLine1,
        addressLine2,
        city,
        country,
        zip,
        profile_pic,
        cover_pic,
        customer_id,
        status,
        subscription,
        view_count,
        created_at,
        updated_at
        ) VALUES (DEFAULT, 
          '${name}',
          '${job}',
          '${company}',
          '${instagram}',
          '${insta_pic}',
          '${linkedin}',
          '${linkedin_pic}',
          '${facebook}',
          '${facebook_pic}',
          '${web_url}',
          '${web_pic}',
          '${email}',
          '${email2}',
          '${phone}',
          '${telephone}',
          '${address}',
          '${addressLine1}',
          '${addressLine2}',
          '${city}',
          '${country}',
          '${zip}',
          '${profile_pic}',
          '${cover_pic}',
          '${customer_id}',
          "created",
          '${subscription}',
          0,
           ?,
           ?)`,
      [currentTime(), currentTime()]
    );

    if (card.insertId) {
      return res.json({ success: true, card: card.insertId });
    }
    return res.json({
      success: false,
      error: "Erreur dans le serveur de base de données",
    });
  } catch (error) {
    console.log(`400 card(create) | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};

const updatecard = async (req, res) => {
  try {
    const {
      id,
      name,
      job,
      company,
      instagram,
      insta_pic,
      linkedin,
      linkedin_pic,
      facebook,
      facebook_pic,
      web_pic,
      web_url,
      email,
      email2,
      phone,
      telephone,
      address,
      addressLine1,
      addressLine2,
      city,
      country,
      zip,
      profile_pic,
      cover_pic,
    } = req.body;

    const card = await Pool.query(
      `UPDATE wpq7oe_vc_cards
        SET 
            name = '${name}',
            job = '${job}',
            company = '${company}',
            instagram = '${instagram}',
            insta_pic = '${insta_pic}',
            linkedin = '${linkedin}',
            linkedin_pic = '${linkedin_pic}',
            facebook = '${facebook}',
            facebook_pic = '${facebook_pic}',
            web_pic = '${web_pic}',
            web_url = '${web_url}',
            email = '${email}',
            email2 = '${email2}',
            phone = '${phone}',
            telephone = '${telephone}',
            address = '${address}',
            addressLine1 = '${addressLine1}',
            addressLine2 = '${addressLine2}',
            city = '${city}',
            country = '${country}',
            zip = '${zip}',
            profile_pic = '${profile_pic}',
            cover_pic = '${cover_pic}',
            updated_at = ? 
        WHERE id = '${id}';
      `,
      [currentTime()]
    );
    if (card) {
      return res.json({ success: true, card: card });
    }
    return res.json({
      success: false,
      error: "Erreur dans le serveur de base de données",
    });
  } catch (error) {
    console.log(`400 card(create) | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};

const getByEmail = async (req, res) => {
  try {
    const query = `
        SELECT * from wpq7oe_vc_cards where email='${req.params.email}';
    `;
    const result = await Pool.query(query);

    if (result.length) {
      return res.json({ success: true, card: result[result.length - 1] });
    } else {
      return res.json({
        success: false,
        error: "Aucun enregistrement trouvé / Adresse e-mail invalide.",
      });
    }
  } catch (error) {
    console.log(`400 card(get) | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const query = `
        UPDATE wpq7oe_vc_cards set status='requested' where id = '${req.body.id}';
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
    console.log(`400 card(get) | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};

const disableCard = async (req, res) => {
  try {
    const query = `
        UPDATE wpq7oe_vc_cards set status='disabled' where id = '${req.body.id}';
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
    console.log(`400 card(get) | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};

const getById = async (req, res) => {
  try {
    // const userAgent = req.headers["user-agent"];
    // console.log("User-Agent:", userAgent);
    await Pool.query(`UPDATE wpq7oe_vc_cards SET view_count = view_count + 1;`);

    const query = `
        SELECT * from wpq7oe_vc_cards where id='${req.params.id}' and status !='disabled';
    `;
    const result = await Pool.query(query);

    if (result.length) {
      return res.json({ success: true, card: result[result.length - 1] });
    } else {
      return res.json({
        success: false,
        error: "Aucun enregistrement trouvé.",
      });
    }
  } catch (error) {
    console.log(`400 card(get) | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};

const getByIdAndVerify = async (req, res) => {
  try {
    let and = ``;

    if (req.user.role == "customer" || req.user.role == "subaccount") {
      and = `AND customer_id='${req.user.id}'`;
    }

    const query = `
        SELECT * from wpq7oe_vc_cards where id='${req.params.id}' ${and};
    `;

    const result = await Pool.query(query);

    if (result.length) {
      return res.json({ success: true, card: result[result.length - 1] });
    } else {
      return res.json({
        success: false,
        error: "Aucun enregistrement trouvé.",
      });
    }
  } catch (error) {
    console.log(`400 card(get) | ${error}`);
    return res.json({ success: false, error: error.message });
  }
};
const submitContact = async (req, res) => {
  try {
    const { firstName, surname, phoneNumber, emailAddress, business } =
      req.body;

    const query = `
      INSERT INTO contacts (first_name, surname, phone_number, email_address, business, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id;
    `;
    const params = [firstName, surname, phoneNumber, emailAddress, business];

    const result = await Pool.query(query, params);

    return res.json({ success: true, contactId: result.rows[0].id });
  } catch (error) {
    console.error(`Error submitting contact: ${error}`);
    return res.status(500).json({ success: false, error: "Database error" });
  }
};

const getContacts = async (req, res) => {
  try {
    const query = `
      SELECT id, first_name AS "firstName", surname, phone_number AS "phoneNumber",
             email_address AS "emailAddress", business, created_at AS "createdAt", notes
      FROM contacts;
    `;

    const result = await Pool.query(query);

    return res.json({ success: true, contacts: result.rows });
  } catch (error) {
    console.error(`Error fetching contacts: ${error}`);
    return res.status(500).json({ success: false, error: "Database error" });
  }
};
module.exports = {
  get,
  create,
  updatecard,
  getByEmail,
  getById,
  updateStatus,
  getByIdAndVerify,
  disableCard,
  submitContact,
  getContacts,
};
