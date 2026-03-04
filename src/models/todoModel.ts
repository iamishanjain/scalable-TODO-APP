import mongoose, { Schema, Document, Model } from "mongoose";

export interface TodoDoc extends Document {
  user: Schema.Types.ObjectId;
  title: string;
  description: string;
  status: string;
}

export enum Status {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export const DOCUMENT_NAME = "Todo";
export const COLLECTION_NAME = "todos";

const todoModel = new Schema<TodoDoc>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: Status.NOT_STARTED,
      enum: Object.values(Status),
    },
  },
  {
    timestamps: true,
  },
);

const Todo: Model<TodoDoc> = mongoose.model<TodoDoc>(
  DOCUMENT_NAME,
  todoModel,
  COLLECTION_NAME,
);

export default Todo;
