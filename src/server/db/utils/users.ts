import { eq } from 'drizzle-orm';
import { db } from '../client';
import { users, type User, type NewUser } from '../schema';

export const getUserById = (userId: number, options = {}) => {
  return db.query.users.findFirst({ where: (users, { eq }) => eq(users.id, userId), ...options });
};

export const getUserByPublicId = (publicId: string, options = {}) => {
  return db.query.users.findFirst({ where: (users, { eq }) => eq(users.public_id, publicId), ...options });
};

export const insertUser = async (user: NewUser): Promise<User[]> => {
  delete user.id;
  delete user.createdAt;
  return db.insert(users).values(user).returning();
};

// TODO:
export const updateUser = async (public_id: string, user: NewUser): Promise<User[]> => {
  delete user.createdAt;
  user.updatedAt = new Date();
  return db.update(users).set(user).where(eq(users.public_id, public_id)).returning();
};
