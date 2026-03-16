# ── Stage 1: Build ───────────────────────────────────────────────────────────
# Use Node 16 — react-scripts 5.0.1 has known issues with Node 18
FROM node:16-alpine AS builder
WORKDIR /app

COPY package*.json ./

# Clean install — no legacy flags needed on Node 16
RUN npm install

COPY . .

ARG REACT_APP_RZP_KEY_ID=rzp_test_CHANGE_ME
ENV REACT_APP_RZP_KEY_ID=$REACT_APP_RZP_KEY_ID

# Disable CI mode so warnings don't break the build
ENV CI=false

RUN npm run build

# ── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
