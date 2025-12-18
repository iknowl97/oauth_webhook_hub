FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
ARG VITE_API_BASE
ENV VITE_API_BASE=$VITE_API_BASE
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine as serve
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"]
