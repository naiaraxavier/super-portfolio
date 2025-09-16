# Imagem base
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Instalar dependências
COPY package.json package-lock.json* ./
RUN npm install

# Copiar o restante do código
COPY . .

# Gerar cliente Prisma
RUN npx prisma generate

# Porta usada pelo Next
EXPOSE 3000

# Rodar em modo dev (pode trocar por "npm run start" em produção)
CMD ["npm", "run", "dev"]
