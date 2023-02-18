const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs").promises;
const colors = require("colors");
const contactsPath = path.join(__dirname, "./db/contacts.json");

colors.setTheme({
  error: "red",
  success: "green",
  info: "magenta",
});

async function listContacts() {
  try {
    const contacts = await fs.readFile(contactsPath, "utf8");
    const parsedContacts = JSON.parse(contacts);
    return console.table(parsedContacts);
  } catch (err) {
    console.error(err);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await fs.readFile(contactsPath, "utf8");
    const parsedContacts = JSON.parse(contacts);

    const contactById = parsedContacts.filter(({ id }) => id === contactId);
    return console.table(contactById);
  } catch (err) {
    console.error(err);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await fs.readFile(contactsPath, "utf8");
    const parsedContacts = JSON.parse(contacts);

    const newContent = parsedContacts.filter(
      (contact) => contact.id !== contactId
    );

    await fs.writeFile(contactsPath, JSON.stringify(newContent));
    const upgradedContacts = await fs.readFile(contactsPath, "utf8");
    const message = `Contact ${contactId} was been successfuly deleted`;
    console.log(message.info);
    console.table(JSON.parse(upgradedContacts));
    return;
  } catch (err) {
    console.error(err);
  }
}

async function addContact(name, email, phone) {
  const newContact = { id: uuidv4(), name, email, phone };
  try {
    const contacts = await fs.readFile(contactsPath, "utf8");
    const parsedContacts = JSON.parse(contacts);

    if (
      parsedContacts.find(
        (contact) => contact.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      const message = `Contact ${name} is already exist `;
      console.log(message.error);
      return;
    }

    if (
      parsedContacts.find(
        (contact) => contact.email.toLowerCase() === email.toLowerCase()
      )
    ) {
      const message = `Email ${email} is already exist `;
      console.log(message.error);
      return;
    }

    if (parsedContacts.find((contact) => contact.phone === phone)) {
      const message = `Phone ${phone} is already exist `;
      console.log(message.error);
      return;
    }

    const newContent = [...parsedContacts, newContact];
    await fs.writeFile(contactsPath, JSON.stringify(newContent), "utf8");
    const message = `Contact ${name} added successfully`;
    console.log(message.success);
    console.table(newContent);
    return;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
