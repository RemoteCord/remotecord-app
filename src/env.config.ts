export const env = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL as unknown as string,
  NEXT_PUBLIC_REAL_API_URL: process.env
    .NEXT_PUBLIC_REAL_API_URL as unknown as string,
  EXPIRATION_TIME: Number(process.env.NEXT_PUBLIC_EXPIRATION_TIME),
  AUTH_SECRET: process.env.AUTH_SECRET as unknown as string,
};

// console.log("env", env);
