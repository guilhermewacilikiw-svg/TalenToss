FROM node:20

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

# Install only backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy backend source
COPY backend ./backend/

# Build backend
RUN cd backend && npx prisma generate && npm run build

# Expose the HuggingFace required port
EXPOSE 7860

# Tell NestJS to run on port 7860
ENV PORT=7860

CMD ["sh", "-c", "cd backend && npm run start:prod"]
