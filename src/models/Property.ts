import { model, Schema } from 'mongoose';

import { DocumentNameMappings } from './helpers';

const PropertySchema = new Schema(
  {
    address: { type: String, required: true },
    price: { type: Number, required: true },
    typeOfSpace: { type: String, required: true },
    size: { type: Number, required: true },
    pictureUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export const Property = model(DocumentNameMappings.Property, PropertySchema);
