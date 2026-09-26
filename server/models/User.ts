import { db, IUser } from '../config/db.js';

export type { IUser };

export const User = {
  async findOne(query: { email?: string; _id?: string }): Promise<IUser | null> {
    if (query.email) {
      return db.findUserByEmail(query.email);
    }
    if (query._id) {
      return db.findUserById(query._id);
    }
    return null;
  },

  async findById(id: string): Promise<IUser | null> {
    return db.findUserById(id);
  },

  async create(userData: { name: string; email: string; password: string }): Promise<IUser> {
    return db.createUser(userData);
  },
};
