FROM node:20-alpine
RUN apk add --no-cache git
WORKDIR /astro
RUN npm init --yes
RUN npm install astro@latest @astrojs/tailwind@latest tailwindcss@latest @tailwindcss/typography@latest
COPY . .
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "4321"]
