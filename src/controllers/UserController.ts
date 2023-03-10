import { Request, Response } from "express";
import { prop } from "lodash/fp";
import { Booking } from "src/models/Booking";
import { Property } from "src/models/Property";
import { MyStripe, StripeUtil } from "src/utils/stripe";
import _ from "lodash";

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
    const { address, price, typeOfSpace, size, pictureUrl, description } =
      req.body;
    const property = await Property.create({
      address,
      price,
      typeOfSpace,
      size,
      pictureUrl,
      description,
    });
    res.send(property);
  },
  getPropertyById: async (req: Request, res: Response) => {
    const { id } = req.params;
    const property = await Property.findById(id);
    property.numViews += 1;
    await property.save();
    res.send(property);
  },
  invoiceWebhook: async (req: Request, res: Response) => {
    const { data, eventType } = StripeUtil.getEventType(req);
    await StripeUtil.triggerInvoiceEventType(eventType, data);
    res.send({});
  },
  getCheckoutUrlForPropertyId: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { emailOfRenter, nameOfRenter, daysBooked } = req.query;
    const property = await Property.findById(id);
    const checkoutSession = await StripeUtil.startCheckoutSession(
      property,
      emailOfRenter,
      nameOfRenter,
      Number(daysBooked)
    );
    res.send(checkoutSession.url);
  },
  getBookingData: async (req: Request, res: Response) => {
    const bookings = await Booking.find().populate("propertyId");
    const totalEarnedInLifetime = _.round(
      _.sumBy(bookings, "pricePaidInDollars"),
      2
    );
    const averageDaysBooked = _.round(
      _.sumBy(bookings, "daysBooked") / bookings.length,
      2
    );
    const averagePricePaid = _.round(
      totalEarnedInLifetime / averageDaysBooked,
      2
    );
    const estimatedEarningsThisYear = _.round(
      (365.0 / (averageDaysBooked * bookings.length)) *
        (averagePricePaid / averageDaysBooked),
      2
    );
    const numBookings = _.round(bookings.length, 2);
    res.send({
      totalEarnedInLifetime,
      averageDaysBooked,
      averagePricePaid,
      estimatedEarningsThisYear,
      numBookings,
    });
  },
};
