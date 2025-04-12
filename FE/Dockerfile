FROM node:18-alpine

#working dir
WORKDIR /app

# Copy pkg files & install deps
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copy all files
COPY . .

# Expose the FE-vite port (5173)
EXPOSE 5173

# Run the app
CMD ["npm", "run", "dev"]
