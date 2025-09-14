import ContactRepository from "./contact.repository";
import { formatResponse } from "../../utils/fomat-response.util";
import Contact from "./contact.model";
import { Op } from "sequelize";

const getIdentity = async (email?: string, phoneNumber?: string) => {
  try {
    const matches = await ContactRepository.getMatches(email, phoneNumber);

    // step 1 : IF NO MACTHES ARE FOUND , CREATE NEW CONATCT WITH PRECEDENCE "primary"
    if (matches.length === 0) {
      const newContact = await ContactRepository.createContact(
        email,
        phoneNumber
      );

      return formatResponse(newContact, []);
    }

    // Step 2: Identify all the primary contact
    const primaryCandidates = [];
    const secondaries = [];

    for (const c of matches) {
      if (c.linkPrecedence === "primary") {
        primaryCandidates.push(c);
      } else if (c.linkedId) {
        const primary = await ContactRepository.getContactById(c.linkedId);

        if (primary) primaryCandidates.push(primary);

        secondaries.push(c);
      }
    }

    // Step 3: Choose oldest primary
    const chosenPrimary = primaryCandidates.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )[0];

    // Step 4: Merge clusters -> flatten to star topology
    for (const p of primaryCandidates) {
      if (p.id !== chosenPrimary.id) {
        // downgrade other primaries
        await Contact.update(
          { linkPrecedence: "secondary", linkedId: chosenPrimary.id },
          { where: { id: p.id } }
        );
        await Contact.update(
          { linkedId: chosenPrimary.id },
          { where: { linkedId: p.id } }
        );
      }
    }

    // Step 5: Create secondary if new info
    const existingEmails = matches.map((m) => m.email).filter(Boolean);
    const existingPhones = matches.map((m) => m.phoneNumber).filter(Boolean);

    let newSecondary = null;
    if (
      (email && !existingEmails.includes(email)) ||
      (phoneNumber && !existingPhones.includes(phoneNumber))
    ) {
      newSecondary = await Contact.create({
        email,
        phoneNumber,
        linkPrecedence: "secondary",
        linkedId: chosenPrimary.id,
      });
    }

    // Step 6: Fetch full cluster
    const cluster = await Contact.findAll({
      where: {
        [Op.or]: [{ id: chosenPrimary.id }, { linkedId: chosenPrimary.id }],
      },
    });

    return formatResponse(chosenPrimary, cluster);
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

const ContactService = {
  getIdentity,
};
export default ContactService;
