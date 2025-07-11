import { SingletonDBConnection } from "../database/dbConnection";
import { DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize";
import { UserRole } from "@/utils/roles";

const sequelize = SingletonDBConnection.getInstance();

/**
 * User Model Definition
 * 
 * @exports User - Sequelize user model
*/

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: string;
  declare email: string;
  declare password: string;
  declare role: UserRole;
  declare tokens: number;
  declare created_at: Date;
  declare updated_at: Date;
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
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
    type: DataTypes.ENUM(...Object.values(UserRole)),
    allowNull: false,
  },
  tokens: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
},
  {
    sequelize,
    modelName: "User",
    tableName: "User",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export { User };

