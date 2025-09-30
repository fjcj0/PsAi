import mongoose, { Document, Schema } from "mongoose";
export interface IUser extends Document {
    googleId: string;
    displayName: string;
    email: string;
    image: string;
}
const userSchema = new Schema<IUser>({
    googleId: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String }
});
export const User = mongoose.model<IUser>("User", userSchema);