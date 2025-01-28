import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
  PORT: number;

  KAFKA_SERVER: string[];
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),

    KAFKA_SERVER: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
  KAFKA_SERVER: process.env.KAFKA_SERVER?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,

  natsServers: envVars.KAFKA_SERVER,
};
