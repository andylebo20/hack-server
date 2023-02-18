import { Request, Response } from "express";
import { prop } from "lodash/fp";
import { Booking } from "src/models/Booking";
import { Property } from "src/models/Property";

export const UserController = {
  bookProperty: async (req: Request, res: Response) => {
    const { propertyId, nameOfRenter, emailOfRenter } = req.body;
    const booking = await Booking.create({
      propertyId,
      nameOfRenter,
      emailOfRenter,
    });
    res.send(booking);
  },
  getProperties: async (req: Request, res: Response) => {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.send(properties);
  },
  createNewProperty: async (req: Request, res: Response) => {
    const { address, price, typeOfSpace, size, pictureUrl } = req.body;
    const property = await Property.create({
      address,
      price,
      typeOfSpace,
      size,
      pictureUrl,
    });
    res.send(property);
  },
  getPropertyById: async (req: Request, res: Response) => {
    const { id } = req.params;
    const property = await Property.findById(id);
    res.send(property);
  },
};
