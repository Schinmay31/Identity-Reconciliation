import { DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "../../config/database.connection";

const Contact = sequelize.define(
  "Contact",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    phoneNumber: {
      type: DataTypes.STRING(20), // 20 chars will include international numbers as well
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
