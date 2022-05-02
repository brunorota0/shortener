/* eslint-disable max-len */
interface EnvSchema {
  name: string
  description: string
  required: boolean
  example: string
  values?: string[]
}

const envSchemaArray: EnvSchema[] = [
  {
    name: 'BASE_URL',
    description: 'Url to shortener',
    required: true,
    example: 'http://localhost:3000'
  },
  {
    name: 'PORT',
    description: 'PORT in which the app runs',
    required: true,
    example: '3000'
  },
  {
    name: 'POSTGRES_DB_URL',
    description: 'Main database URI',
    required: true,
    example: 'postgresql://user:password@localhost:5432/shortener'
  },
  {
    name: 'DB_LOCAL',
    description: 'Specifies if the main database is hosted locally',
    required: false,
    values: ['true', 'false'],
    example: ''
  },
  {
    name: 'DEBUG',
    description: 'Enables debugs method for logger',
    required: false,
    values: ['true', 'false'],
    example: ''
  },
  {
    name: 'TEST_POSTGRES_DB_URL',
    description: 'Test database URI',
    required: false,
    example: 'postgresql://postgres:postgres@localhost:5432/shortener-test'
  },
];

const formatDisplay = (missingEnvVars: any[], invalidValues: any[]) => {
  let formattedList = [];
  if (missingEnvVars.length > 0) formattedList = ['Missing vars', ...missingEnvVars];
  if (invalidValues.length > 0) formattedList = [...formattedList, 'Invalid values', ...invalidValues];

  if (formattedList.length > 0) {
    throw new Error(`CATCH ${JSON.stringify(formattedList)}`);
  }
};

export const checkEnvironmentVars = () => {
  const missingEnvVars: EnvSchema[] = [];
  const invalidValues: EnvSchema[] = [];
  const envs: string[] = Object.keys(process.env);

  for (const schema of envSchemaArray) {
    const foundEnv = envs.find((x) => x === schema.name);

    if (schema.required && (!foundEnv || !process.env[schema.name])) {
      missingEnvVars.push(schema);
      continue;
    }

    if (schema.values && schema.values.length > 0 && process.env[schema.name]) {
      const value: string = process.env[schema.name];
      const validValue = schema.values.find((x) => x === value);
      if (!validValue) {
        invalidValues.push(schema);
        continue;
      }
    }
  }
  formatDisplay(missingEnvVars, invalidValues);
};
