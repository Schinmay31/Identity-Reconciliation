import { Op, WhereOptions } from "sequelize";
import Contact from "./contact.model";

const getMatches = async (email?: String, phoneNumber?: string) => {
  try {
    const conditions: WhereOptions[] = [
      email ? { email } : undefined,
      phoneNumber ? { phoneNumber } : undefined,
    ].filter(Boolean) as WhereOptions[];

    const matches = await Contact.findAll({
      where: {
        [Op.or]: conditions,
      },
    });

    // convert to json
    const matchesJson = matches.map((match) => match.toJSON());

    return matchesJson;
  } catch (error) {
    console.log("Error fetching contact matches", error);
    throw error;
  }
};

const createContact = async (email?: string, phoneNumber?: string) => {
  try {
    const newContact = await Contact.create({
      email: email || null,
      phoneNumber: phoneNumber || null,
      linkPrecedence: "primary",
    });
    return newContact.toJSON();
  } catch (error) {
    console.log("Error creating contact");
    throw error;
  }
};

const getContactById = async (id: string) => {
  try {
    const contact = await Contact.findByPk(id);

    if (contact) return contact.toJSON();

    return null;
  } catch (error) {
    console.log("Error fetching contact");
  }
};
const ContactRepository = {
  getMatches,
  createContact,
  getContactById,
};
export default ContactRepository;
