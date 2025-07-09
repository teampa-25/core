import { DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import sequelize from "../config/sequelize";

interface UserModel {
  id: string; // UUID
  email: string;
  password: string;
  role: Role; // Admin or User
  tokens: number;
  createdAt: Date;
}

/**
 * Interface UserCreationAttributes is used to define the attributes that can be passed when creating a new User instance.
 * It extends Optional to make 'id' and 'createdAt' optional, as they will
 */
interface UserCreationAttributes
  extends Optional<UserModel, "id" | "createdAt"> {}

class User
  extends Model<UserModel, UserCreationAttributes>
  implements UserModel
{
  public readonly id!: string;
  public email!: string;
  public password!: string;
  public role!: Role;
  public tokens!: number;
  public readonly createdAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
    tokens: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "Users",
    timestamps: false,
    createdAt: "createdAt",
    updatedAt: false,
  },
);

export default UserModel;
