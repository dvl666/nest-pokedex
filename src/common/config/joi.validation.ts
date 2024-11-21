/**
 * Este codigo es para validar las variables de entorno con Joi
 * si hay alguna variable que no cumpla con el esquema, se lanzará un error
 * posterior a validarlas aca hay que a;adir el un parametro en el app module
 * ver app.module.ts
 */

import * as joi from 'joi'

export const JoiValidationSchema = joi.object({
    MONGODB: joi.required(),
    PORT: joi.number().default(3000),
    DEFAULT_LIMIT: joi.number().default(10),
})