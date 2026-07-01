FROM node:20-alpine

WORKDIR /app

# Install dependencies for both apps
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

RUN cd backend && npm install
RUN cd frontend && npm install

# Copy source code
COPY backend ./backend/
COPY frontend ./frontend/

# Generate Prisma client and build backend
RUN cd backend && npx prisma generate && npm run build

# Build frontend
# We set the NEXT_PUBLIC_API_URL so it compiles expecting the backend at the same domain
RUN cd frontend && NEXT_PUBLIC_API_URL="" npm run build

# Copy start script
COPY start.sh ./
RUN chmod +x ./start.sh

# Install concurrently to run both servers
RUN npm install -g concurrently

# HuggingFace spaces expose port 7860
EXPOSE 7860

CMD ["./start.sh"]
