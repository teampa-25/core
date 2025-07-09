import {
  Model,
  DataTypes,
  UUIDV4,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasMany,
} from "sequelize";
import sequelize from "../../config/sequelize";
import { Role } from "../../utils/enums";

/**
 * Interface User defines the structure of a User object in the database.
 * InferAttributes<User> is used to infer the attributes of the User model.
 * InferCreationAttributes<User> is used to infer the attributes that can be used when creating
 * a new User instance.
 * CreationOptional is used to indicate that certain fields can be optional during creation.
 */
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<string>;
  declare email: string;
  declare password: string;
  declare role: Role;
  declare tokens: number;
  declare createdAt: CreationOptional<Date>; // CreationOptional indicates that this field can be omitted when creating a new instance
  declare updatedAt: CreationOptional<Date>;
}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
    tokens: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 100 },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "Users",
    timestamps: true,
  },
);

export default User;
