import mongoose, { Document, Model, Schema } from 'mongoose';

// ─────────────────────────────────────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────────────────────────────────────

export interface IServiceItem {
  type: 'tractor' | 'irrigation' | 'fertilizer' | 'labor' | 'machinery' | 'transport' | 'other';
  title: string;
  description?: string;
  price: number;
  priceUnit: 'per_hour' | 'per_bigha' | 'per_day' | 'fixed';
  isAvailable: boolean;
}

export interface IServiceProviderProfile extends Document {
  userId: mongoose.Types.ObjectId;
  businessName: string;
  ownerName?: string;
  description?: string;
  services: IServiceItem[];
  district: string;
  upazila: string;
  address?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  contactPhone?: string;
  whatsapp?: string;
  experienceYears?: number;
  rating: number;
  totalReviews: number;
  documents: string[];
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type ServiceProviderProfileModel = Model<IServiceProviderProfile>;

// ─────────────────────────────────────────────────────────────────────────────
// Sub-schema — ServiceItem
// ─────────────────────────────────────────────────────────────────────────────

const serviceItemSchema = new Schema<IServiceItem>(
  {
    type: {
      type: String,
      enum: {
        values: ['tractor', 'irrigation', 'fertilizer', 'labor', 'machinery', 'transport', 'other'],
        message: 'Service type must be one of: tractor, irrigation, fertilizer, labor, machinery, transport, other',
      },
      required: [true, 'Service type is required'],
    },

    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },

    description: { type: String, trim: true },

    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },

    priceUnit: {
      type: String,
      enum: {
        values: ['per_hour', 'per_bigha', 'per_day', 'fixed'],
        message: 'Price unit must be one of: per_hour, per_bigha, per_day, fixed',
      },
      default: 'per_hour',
    },

    isAvailable: { type: Boolean, default: true },
  },
  { _id: false }
);

// ─────────────────────────────────────────────────────────────────────────────
// Schema — ServiceProviderProfile
// ─────────────────────────────────────────────────────────────────────────────

const serviceProviderProfileSchema = new Schema<IServiceProviderProfile, ServiceProviderProfileModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
      unique: true,
      index: true,
    },

    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
    },

    ownerName: { type: String, trim: true },

    description: { type: String, trim: true },

    services: { type: [serviceItemSchema], default: [] },

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

    address: { type: String, trim: true },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: { type: [Number] }, // [longitude, latitude]
    },

    contactPhone: { type: String, trim: true },

    whatsapp: { type: String, trim: true },

    experienceYears: {
      type: Number,
      min: [0, 'Experience years cannot be negative'],
    },

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

serviceProviderProfileSchema.index({ location: '2dsphere' });
serviceProviderProfileSchema.index({ 'services.type': 1 });
serviceProviderProfileSchema.index({ district: 1, upazila: 1 });
serviceProviderProfileSchema.index({ isApproved: 1 });

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

const ServiceProviderProfile = mongoose.model<IServiceProviderProfile, ServiceProviderProfileModel>(
  'ServiceProviderProfile',
  serviceProviderProfileSchema
);

export default ServiceProviderProfile;
