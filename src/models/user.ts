import { Database } from "@/database/database";
import { DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize";
import { UserRole } from "@/models/enums/user.role";

const sequelize = Database.getInstance();


/**
 * User Model Definition
 * 
 * @exports UserModel - Sequelize user model
*/

// inferattributes automatically infers what attributes the UserModel has
// we don't need a UserAttributes interface
export class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  declare id?: string;
  declare email: string;
  declare password:string;
  declare role: UserRole;
  declare credit?: number;
  declare created_at?: Date;
  declare updated_at?: Date;
}

UserModel.init({
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
  credit: {
    type: DataTypes.INTEGER,
    validate: { min: 0 },
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


