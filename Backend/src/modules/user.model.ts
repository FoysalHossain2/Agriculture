import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { USER_ROLES, UserRole } from '../constants';

// ─────────────────────────────────────────────────────────────────────────────
// Interface — instance methods & document shape
// ─────────────────────────────────────────────────────────────────────────────

export interface IUser extends Document {
  username: string;
  email: string;
  fullname: string;
  password: string;
  role: UserRole;
  avatar?: string;          // Cloudinary URL
  phone?: string;
  address?: string;
  isVerified: boolean;
  isActive: boolean;
  refreshTokens: string[];  // stores hashed refresh tokens (rotation)
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Interface — static model methods
// ─────────────────────────────────────────────────────────────────────────────

export interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────────────────────────────────────

const userSchema = new Schema<IUser, IUserModel>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },

    fullname: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      index: true,
      minlength: [2, 'Full name must be at least 2 characters'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // never return password in queries by default
    },

    role: {
      type: String,
      enum: {
        values: Object.values(USER_ROLES),
        message: `Role must be one of: ${Object.values(USER_ROLES).join(', ')}`,
      },
      default: USER_ROLES.FARMER,
    },

    avatar: {
      type: String,
      default: null,
    },

    phone: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
      match: [/^01[3-9]\d{8}$/, 'Please provide a valid Bangladeshi phone number'],
    },

    address: {
      type: String,
      trim: true,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Array of hashed refresh tokens for multi-device support & token rotation
    refreshTokens: {
      type: [String],
      select: false, // don't expose in queries
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Indexes
// ─────────────────────────────────────────────────────────────────────────────

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });

// ─────────────────────────────────────────────────────────────────────────────
// Pre-save hook — hash password before saving
// ─────────────────────────────────────────────────────────────────────────────

userSchema.pre<IUser>('save', async function (next) {
  // Only hash if password was modified (or new document)
  if (!this.isModified('password')) return next();

  try {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Instance Methods
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compare a plain-text password against the stored bcrypt hash.
 */
userSchema.methods.isPasswordCorrect = async function (
  this: IUser,
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Generate a short-lived JWT Access Token.
 * Payload: { _id, email, username, role }
 */
userSchema.methods.generateAccessToken = function (this: IUser): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined in environment');

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      role: this.role,
    },
    secret,
    {
      expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as jwt.SignOptions['expiresIn'],
    }
  );
};

/**
 * Generate a long-lived JWT Refresh Token.
 * Payload: { _id } — minimal, identity-only
 */
userSchema.methods.generateRefreshToken = function (this: IUser): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET is not defined in environment');

  return jwt.sign(
    { _id: this._id },
    secret,
    {
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '30d') as jwt.SignOptions['expiresIn'],
    }
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Static Methods
// ─────────────────────────────────────────────────────────────────────────────

userSchema.statics.findByEmail = function (email: string): Promise<IUser | null> {
  return this.findOne({ email: email.toLowerCase().trim() }).select('+password +refreshTokens');
};

// ─────────────────────────────────────────────────────────────────────────────
// Hide sensitive fields in JSON output
// ─────────────────────────────────────────────────────────────────────────────

userSchema.set('toJSON', {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(_doc: any, ret: any) {
    ret.password = undefined;
    ret.refreshTokens = undefined;
    return ret;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

const User = mongoose.model<IUser, IUserModel>('User', userSchema);

export default User;