FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

# Install system deps for canvas
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
RUN npm install --production

COPY . .

CMD ["node", "index.js"]
