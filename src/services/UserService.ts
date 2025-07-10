import { User } from "../database/models/Users";
import { RepositoryFactory } from "../repositories/RepositoryFactory";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { logger } from "../config/logger";
import { Role } from "../utils/role";
import crypto from "crypto";

/**
 * User Service
 * Business logic layer for user operations
 */
export class UserService {
  private userRepository: IUserRepository;

  constructor() {
    this.userRepository = RepositoryFactory.createUserRepository();
  }

  /**
   * Create a new user
   */
  async createUser(userData: {
    email: string;
    password: string;
    role?: Role;
    tokens?: number;
  }): Promise<User> {
    try {
      logger.info(`Creating new user: ${userData.email}`);

      // Business logic validation
      if (!userData.email || userData.email.trim().length === 0) {
        throw new Error("Email is required");
      }

      if (!userData.password || userData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error("Invalid email format");
      }

      // Check if user with same email already exists
      const existingUser = await this.userRepository.findByEmail(
        userData.email,
      );
      if (existingUser) {
        throw new Error(`User with email "${userData.email}" already exists`);
      }

      // Hash password using crypto (simple hash for now)
      const hashedPassword = crypto
        .createHash("sha256")
        .update(userData.password)
        .digest("hex");

      // Create the user
      const newUser = await this.userRepository.create({
        email: userData.email.toLowerCase().trim(),
        password: hashedPassword,
        role: userData.role || "user",
        tokens: userData.tokens || 100,
      } as any);

      logger.info(`User created successfully with ID: ${newUser.id}`);
      return newUser;
    } catch (error) {
      logger.error(`Error creating user: ${error}`);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      logger.info(`Fetching user with ID: ${id}`);

      if (!id || id.trim().length === 0) {
        throw new Error("User ID is required");
      }

      const user = await this.userRepository.findById(id);

      if (!user) {
        logger.warn(`User with ID ${id} not found`);
        return null;
      }

      logger.info(`User found: ${user.email}`);
      return user;
    } catch (error) {
      logger.error(`Error fetching user by ID: ${error}`);
      throw error;
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      logger.info(`Fetching user with email: ${email}`);

      if (!email || email.trim().length === 0) {
        throw new Error("Email is required");
      }

      const user = await this.userRepository.findByEmail(
        email.toLowerCase().trim(),
      );

      if (!user) {
        logger.warn(`User with email ${email} not found`);
        return null;
      }

      logger.info(`User found: ${user.id}`);
      return user;
    } catch (error) {
      logger.error(`Error fetching user by email: ${error}`);
      throw error;
    }
  }

  /**
   * Authenticate user with email and password
   */
  async authenticateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    try {
      logger.info(`Authenticating user: ${email}`);

      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const user = await this.userRepository.findByEmail(
        email.toLowerCase().trim(),
      );

      if (!user) {
        logger.warn(
          `Authentication failed: User with email ${email} not found`,
        );
        return null;
      }

      // Verify password
      const hashedInputPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");
      const isPasswordValid = hashedInputPassword === user.password;

      if (!isPasswordValid) {
        logger.warn(
          `Authentication failed: Invalid password for user ${email}`,
        );
        return null;
      }

      logger.info(`User authenticated successfully: ${user.id}`);
      return user;
    } catch (error) {
      logger.error(`Error authenticating user: ${error}`);
      throw error;
    }
  }

  /**
   * Update user information
   */
  async updateUser(
    id: string,
    updateData: {
      email?: string;
      password?: string;
      role?: Role;
    },
  ): Promise<User | null> {
    try {
      logger.info(`Updating user with ID: ${id}`);

      // Check if user exists
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new Error(`User with ID ${id} not found`);
      }

      // Validate email if provided
      if (updateData.email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updateData.email)) {
          throw new Error("Invalid email format");
        }

        // Check if another user with same email exists
        const userWithSameEmail = await this.userRepository.findByEmail(
          updateData.email,
        );
        if (userWithSameEmail && userWithSameEmail.id !== id) {
          throw new Error(
            `User with email "${updateData.email}" already exists`,
          );
        }
        updateData.email = updateData.email.toLowerCase().trim();
      }

      // Hash password if provided
      if (updateData.password !== undefined) {
        if (updateData.password.length < 6) {
          throw new Error("Password must be at least 6 characters long");
        }
        updateData.password = crypto
          .createHash("sha256")
          .update(updateData.password)
          .digest("hex");
      }

      // Prepare update data
      const updatePayload = { ...updateData };

      // Remove undefined values
      Object.keys(updatePayload).forEach((key) => {
        if (updatePayload[key as keyof typeof updatePayload] === undefined) {
          delete updatePayload[key as keyof typeof updatePayload];
        }
      });

      const updatedUser = await this.userRepository.update(id, updatePayload);

      logger.info(`User updated successfully: ${updatedUser?.email}`);
      return updatedUser;
    } catch (error) {
      logger.error(`Error updating user: ${error}`);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      logger.info(`Deleting user with ID: ${id}`);

      // Check if user exists
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new Error(`User with ID ${id} not found`);
      }

      // Business logic: You might want to check if user has active datasets, jobs, etc.
      // For now, we'll proceed with deletion

      const deleted = await this.userRepository.delete(id);

      if (deleted) {
        logger.info(`User with ID ${id} deleted successfully`);
      } else {
        logger.warn(`Failed to delete user with ID ${id}`);
      }

      return deleted;
    } catch (error) {
      logger.error(`Error deleting user: ${error}`);
      throw error;
    }
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: Role): Promise<User[]> {
    try {
      logger.info(`Fetching users with role: ${role}`);

      const users = await this.userRepository.findByRole(role);

      logger.info(`Found ${users.length} users with role ${role}`);
      return users;
    } catch (error) {
      logger.error(`Error fetching users by role: ${error}`);
      throw error;
    }
  }

  /**
   * Update user tokens
   */
  async updateUserTokens(id: string, tokens: number): Promise<User | null> {
    try {
      logger.info(`Updating tokens for user ${id} to ${tokens}`);

      if (tokens < 0) {
        throw new Error("Tokens cannot be negative");
      }

      // Check if user exists
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new Error(`User with ID ${id} not found`);
      }

      const updatedUser = await this.userRepository.updateTokens(id, tokens);

      logger.info(
        `User tokens updated successfully: ${updatedUser?.email}, tokens: ${tokens}`,
      );
      return updatedUser;
    } catch (error) {
      logger.error(`Error updating user tokens: ${error}`);
      throw error;
    }
  }

  /**
   * Deduct tokens from user
   */
  async deductTokens(id: string, amount: number): Promise<User | null> {
    try {
      logger.info(`Deducting ${amount} tokens from user ${id}`);

      if (amount <= 0) {
        throw new Error("Deduction amount must be positive");
      }

      // Check if user has sufficient tokens
      const hasSufficientTokens = await this.userRepository.hasSufficientTokens(
        id,
        amount,
      );
      if (!hasSufficientTokens) {
        throw new Error("Insufficient tokens");
      }

      const updatedUser = await this.userRepository.deductTokens(id, amount);

      logger.info(
        `Tokens deducted successfully from user ${id}, amount: ${amount}`,
      );
      return updatedUser;
    } catch (error) {
      logger.error(`Error deducting tokens: ${error}`);
      throw error;
    }
  }

  /**
   * Add tokens to user
   */
  async addTokens(id: string, amount: number): Promise<User | null> {
    try {
      logger.info(`Adding ${amount} tokens to user ${id}`);

      if (amount <= 0) {
        throw new Error("Addition amount must be positive");
      }

      // Check if user exists
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new Error(`User with ID ${id} not found`);
      }

      const updatedUser = await this.userRepository.addTokens(id, amount);

      logger.info(`Tokens added successfully to user ${id}, amount: ${amount}`);
      return updatedUser;
    } catch (error) {
      logger.error(`Error adding tokens: ${error}`);
      throw error;
    }
  }

  /**
   * Check if user has sufficient tokens
   */
  async checkUserTokens(id: string, requiredAmount: number): Promise<boolean> {
    try {
      logger.info(`Checking if user ${id} has ${requiredAmount} tokens`);

      if (requiredAmount < 0) {
        throw new Error("Required amount cannot be negative");
      }

      const hasSufficientTokens = await this.userRepository.hasSufficientTokens(
        id,
        requiredAmount,
      );

      logger.info(`Token check result for user ${id}: ${hasSufficientTokens}`);
      return hasSufficientTokens;
    } catch (error) {
      logger.error(`Error checking user tokens: ${error}`);
      throw error;
    }
  }

  /**
   * Get users with low tokens
   */
  async getUsersWithLowTokens(threshold: number = 10): Promise<User[]> {
    try {
      logger.info(`Fetching users with tokens below ${threshold}`);

      if (threshold < 0) {
        throw new Error("Threshold cannot be negative");
      }

      const users = await this.userRepository.findUsersWithLowTokens(threshold);

      logger.info(`Found ${users.length} users with low tokens`);
      return users;
    } catch (error) {
      logger.error(`Error fetching users with low tokens: ${error}`);
      throw error;
    }
  }

  /**
   * Get all users with pagination
   */
  async getAllUsers(filters?: {
    role?: Role;
    limit?: number;
    offset?: number;
  }): Promise<{ users: User[]; total: number }> {
    try {
      logger.info("Fetching all users with filters:", filters);

      let users: User[];

      if (filters?.role) {
        users = await this.userRepository.findByRole(filters.role);
      } else {
        users = await this.userRepository.findAll();
      }

      const total = users.length;

      // Apply pagination if specified
      if (filters?.limit) {
        const offset = filters.offset || 0;
        users = users.slice(offset, offset + filters.limit);
      }

      logger.info(`Found ${users.length} users out of ${total} total`);
      return { users, total };
    } catch (error) {
      logger.error(`Error fetching all users: ${error}`);
      throw error;
    }
  }

  /**
   * Change user password
   */
  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    try {
      logger.info(`Changing password for user ${id}`);

      // Get user
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }

      // Verify current password
      const hashedCurrentPassword = crypto
        .createHash("sha256")
        .update(currentPassword)
        .digest("hex");
      const isCurrentPasswordValid = hashedCurrentPassword === user.password;
      if (!isCurrentPasswordValid) {
        throw new Error("Current password is incorrect");
      }

      // Validate new password
      if (newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters long");
      }

      // Hash new password
      const hashedNewPassword = crypto
        .createHash("sha256")
        .update(newPassword)
        .digest("hex");

      // Update password
      const updatedUser = await this.userRepository.update(id, {
        password: hashedNewPassword,
      });

      const success = updatedUser !== null;
      logger.info(`Password change result for user ${id}: ${success}`);
      return success;
    } catch (error) {
      logger.error(`Error changing password: ${error}`);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<{
    totalUsers: number;
    usersByRole: Record<Role, number>;
    averageTokens: number;
    usersWithLowTokens: number;
  }> {
    try {
      logger.info("Fetching user statistics");

      const allUsers = await this.userRepository.findAll();

      // Calculate statistics
      const totalUsers = allUsers.length;
      const usersByRole = allUsers.reduce(
        (acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        },
        {} as Record<Role, number>,
      );

      const totalTokens = allUsers.reduce((sum, user) => sum + user.tokens, 0);
      const averageTokens =
        totalUsers > 0 ? Math.round(totalTokens / totalUsers) : 0;

      const usersWithLowTokens = allUsers.filter(
        (user) => user.tokens < 10,
      ).length;

      const stats = {
        totalUsers,
        usersByRole,
        averageTokens,
        usersWithLowTokens,
      };

      logger.info("User statistics:", stats);
      return stats;
    } catch (error) {
      logger.error(`Error fetching user statistics: ${error}`);
      throw error;
    }
  }
}
