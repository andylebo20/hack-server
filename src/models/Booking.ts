import { ObjectId } from 'mongodb';
import { model, Schema } from 'mongoose';

import { DocumentNameMappings } from './helpers';

const BookingSchema = new Schema(
  {
    propertyId: { type: ObjectId, ref: DocumentNameMappings.Property, required: true },
    nameOfRenter: { type: String, required: true },
    emailOfRenter: { type: String, required: true }
  },
  { timestamps: true }
);

export const Booking = model(DocumentNameMappings.Booking, BookingSchema);