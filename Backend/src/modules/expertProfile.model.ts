import mongoose, { Document, Model, Schema } from 'mongoose';

// ─────────────────────────────────────────────────────────────────────────────
// Interface
// ─────────────────────────────────────────────────────────────────────────────

export interface IExpertProfile extends Document {
  userId: mongoose.Types.ObjectId;
  specialization: string[]; // e.g. ['crop_disease', 'soil', 'pest', 'organic']
  qualifications: string[];
  experienceYears: number;
  bio?: string;
  district?: string;
  consultationFee?: number;
  availableForChat: boolean;
  rating: number;
  totalReviews: number;
  documents: string[]; // certificates, credentials
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type ExpertProfileModel = Model<IExpertProfile>;

// ─────────────────────────────────────────────────────────────────────────────
// Schema — ExpertProfile
// ─────────────────────────────────────────────────────────────────────────────

const expertProfileSchema = new Schema<IExpertProfile, ExpertProfileModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
      unique: true,
      index: true,
    },

    specialization: {
      type: [String],
      required: [true, 'At least one specialization is required'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'At least one specialization is required',
      },
    },

    qualifications: { type: [String], default: [] },

    experienceYears: {
      type: Number,
      required: [true, 'Experience years is required'],
      min: [0, 'Experience years cannot be negative'],
    },

    bio: {
      type: String,
      trim: true,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },

    district: { type: String, trim: true },

    consultationFee: {
      type: Number,
      min: [0, 'Consultation fee cannot be negative'],
    },

    availableForChat: { type: Boolean, default: true },

    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot exceed 5'],
    },

    totalReviews: { type: Number, default: 0 },

    documents: { type: [String], default: [] },

    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

// ─────────────────────────────────────────────────────────────────────────────
// Indexes
// ─────────────────────────────────────────────────────────────────────────────

expertProfileSchema.index({ specialization: 1 });
expertProfileSchema.index({ isApproved: 1 });
expertProfileSchema.index({ availableForChat: 1 });

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

const ExpertProfile = mongoose.model<IExpertProfile, ExpertProfileModel>(
  'ExpertProfile',
  expertProfileSchema
);

export default ExpertProfile;
