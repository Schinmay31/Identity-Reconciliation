export const formatResponse = (primary : any, cluster:any) => {
  const emails = new Set();
  const phones = new Set();
  const secondaryIds = [];

  for (const c of cluster) {
    if (c.email) emails.add(c.email);
    if (c.phoneNumber) phones.add(c.phoneNumber);
    if (c.linkPrecedence === "secondary") secondaryIds.push(c.id);
  }

  return {
    contact: {
      primaryContatctId: primary.id,
      emails: primary.email
        ? [primary.email, ...Array.from(emails).filter((e) => e !== primary.email)]
        : Array.from(emails),
       phoneNumbers: primary.phoneNumber
        ? [primary.phoneNumber, ...Array.from(phones).filter((p) => p !== primary.phoneNumber)]
        : Array.from(phones),
      secondaryContactIds: secondaryIds,
    },
  };
}