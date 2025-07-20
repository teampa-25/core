import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
} from "sequelize";
import { UserRole } from "@/common/enums";

/**
 * User Model Definition
 *
 * @exports UserModel - Sequelize user model
 */

// inferattributes automatically infers what attributes the UserModel has
// we don't need a UserAttributes interface
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  public id?: string;
  public email!: string;
  public password!: string;
  public role!: UserRole;
  public credit!: number;
  public created_at?: Date;
  public updated_at?: Date;

  static initModel(sequelize: Sequelize) {
    User.init(
      {
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
      },
    );
  }
}
