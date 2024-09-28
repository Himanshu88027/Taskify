import mongoose, { Schema, Document } from "mongoose";

export interface TodoTasks extends Document {
  task: string;
  isCompleted: boolean;
  priority: number;
  progress: number;
  createdAt: Date;
}

export const TodoTasksSchema: Schema<TodoTasks> = new Schema({
  task: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean
  },
  priority: {
    type: Number
  },
  progress: {
    type: Number
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface TodoType extends Document {
  task: string;
  todoTasks: TodoTasks[];
  createdAt: Date;
}

export const TodoTypeSchema: Schema<TodoType> = new Schema({
  task: {
    type: String,
    required: true,
  },
  todoTasks: [TodoTasksSchema],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  todoTypes: TodoType[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify code expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  todoTypes: {
    type: [TodoTypeSchema],
    default: [],
  },
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
