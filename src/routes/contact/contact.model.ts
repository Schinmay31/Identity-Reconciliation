import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.connection";
import { v4 as uuidv4 } from "uuid";

const Contact = sequelize.define(
  "Contact",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true,
    },
    phoneNumber: {
      type: DataTypes.STRING(20), // 20 chars will include international numbers as well
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    linkedId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Contacts", // self refrence
        key: "id",
      },
    },
    linkPrecedence: {
      type: DataTypes.ENUM("primary", "secondary"),
      allowNull: false,
    },
  },
  {
    tableName: "Contacts",
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ["email"] },
      { fields: ["phoneNumber"] },
      { fields: ["linkedId"] },
    ],
  }
);

export default Contact;
