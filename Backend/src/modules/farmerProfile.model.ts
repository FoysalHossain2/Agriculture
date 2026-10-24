import mongoose, { Document, Model, Schema } from 'mongoose';

// ─────────────────────────────────────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────────────────────────────────────

export interface ICrop {
  name: string;
  variety?: string;
  plantingDate?: Date;
  expectedHarvestDate?: Date;
  areaInBigha?: number;
  status: 'planned' | 'growing' | 'harvested' | 'failed';
}

export interface IFarmerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  farmName?: string;
  totalLandSize?: number; // in landUnit
  landUnit: 'bigha' | 'acre' | 'hectare';
  district: string;
  upazila: string;
  village?: string;
  address?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  crops: ICrop[];
  experienceYears?: number;
  isOrganic: boolean;
  documents?: string[]; // NID, land ownership docs, etc.
  createdAt: Date;
  updatedAt: Date;
}

type FarmerProfileModel = Model<IFarmerProfile>;

// ─────────────────────────────────────────────────────────────────────────────
// Sub-schema — Crop
// ─────────────────────────────────────────────────────────────────────────────

const cropSchema = new Schema<ICrop>(
  {
    name: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    variety: { type: String, trim: true },
    plantingDate: Date,
    expectedHarvestDate: Date,
    areaInBigha: { type: Number, min: 0 },
    status: {
      type: String,
      enum: {
        values: ['planned', 'growing', 'harvested', 'failed'],
        message: 'Status must be one of: planned, growing, harvested, failed',
      },
      default: 'planned',
    },
  },
  { _id: false }
);

// ─────────────────────────────────────────────────────────────────────────────
// Schema — FarmerProfile
// ─────────────────────────────────────────────────────────────────────────────

const farmerProfileSchema = new Schema<IFarmerProfile, FarmerProfileModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
      unique: true,
      index: true,
    },

    farmName: { type: String, trim: true },

    totalLandSize: {
      type: Number,
      min: [0, 'Land size cannot be negative'],
    },

    landUnit: {
      type: String,
      enum: {
        values: ['bigha', 'acre', 'hectare'],
        message: 'Land unit must be one of: bigha, acre, hectare',
      },
      default: 'bigha',
    },

    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
      index: true,
    },

    upazila: {
      type: String,
      required: [true, 'Upazila is required'],
      trim: true,
      index: true,
    },

    village: { type: String, trim: true },

    address: { type: String, trim: true },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: { type: [Number] }, // [longitude, latitude]
    },

    crops: { type: [cropSchema], default: [] },

    experienceYears: {
      type: Number,
      min: [0, 'Experience years cannot be negative'],
    },

    isOrganic: { type: Boolean, default: false },

    documents: { type: [String], default: [] },
  },
  { timestamps: true, versionKey: false }
);

// ─────────────────────────────────────────────────────────────────────────────
// Indexes
// ─────────────────────────────────────────────────────────────────────────────

farmerProfileSchema.index({ location: '2dsphere' });
farmerProfileSchema.index({ district: 1, upazila: 1 });

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

const FarmerProfile = mongoose.model<IFarmerProfile, FarmerProfileModel>(
  'FarmerProfile',
  farmerProfileSchema
);

export default FarmerProfile;
