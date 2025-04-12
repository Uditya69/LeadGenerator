
FROM node:18-alpine

#working dir
WORKDIR /app

# Copy pkg files & install deps
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copy all files
COPY . .

# Expose BE port (3000)
EXPOSE 3000

# Start the server
CMD ["npm","run" ,"dev"]
