import mongoose, { Document, Model, Schema } from 'mongoose';

// ─────────────────────────────────────────────────────────────────────────────
// Interface
// ─────────────────────────────────────────────────────────────────────────────

export interface IBuyerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  businessName?: string;
  businessType: 'individual' | 'retailer' | 'wholesaler' | 'company' | 'restaurant';
  district: string;
  upazila?: string;
  address?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  preferredCrops: string[];
  documents: string[];
  createdAt: Date;
  updatedAt: Date;
}

type BuyerProfileModel = Model<IBuyerProfile>;

// ─────────────────────────────────────────────────────────────────────────────
// Schema — BuyerProfile
// ─────────────────────────────────────────────────────────────────────────────

const buyerProfileSchema = new Schema<IBuyerProfile, BuyerProfileModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
      unique: true,
      index: true,
    },

    businessName: { type: String, trim: true },

    businessType: {
      type: String,
      enum: {
        values: ['individual', 'retailer', 'wholesaler', 'company', 'restaurant'],
        message: 'Business type must be one of: individual, retailer, wholesaler, company, restaurant',
      },
      default: 'individual',
    },

    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
      index: true,
    },

    upazila: { type: String, trim: true },

    address: { type: String, trim: true },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: { type: [Number] }, // [longitude, latitude]
    },

    preferredCrops: { type: [String], default: [] },

    documents: { type: [String], default: [] },
  },
  { timestamps: true, versionKey: false }
);

// ─────────────────────────────────────────────────────────────────────────────
// Indexes
// ─────────────────────────────────────────────────────────────────────────────

buyerProfileSchema.index({ location: '2dsphere' });
buyerProfileSchema.index({ district: 1 });

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

const BuyerProfile = mongoose.model<IBuyerProfile, BuyerProfileModel>(
  'BuyerProfile',
  buyerProfileSchema
);

export default BuyerProfile;
