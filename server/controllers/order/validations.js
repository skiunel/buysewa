import Joi from 'joi';

const OrderSchema = Joi.object({
  address: Joi.string().required(),
  items: Joi.alternatives().try(
    Joi.array().items(Joi.string()).min(1),
    Joi.string()
  ).required(),
}).options({ allowUnknown: true });

export default OrderSchema;
