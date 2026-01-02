FROM node:20-alpine

# Definir o fuso horário para UTC (zero)
ENV TZ=UTC

# Criar diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json (se existir)
COPY package*.json ./

# Instalar todas as dependências (incluindo devDependencies para ts-node)
RUN npm install

# Copiar a pasta src, types, tsconfig.json e o arquivo main.js
COPY src ./src
COPY types ./types
COPY tsconfig.json .
COPY main.js .

# Comando padrão para executar o main.js com suporte a TypeScript
CMD ["node", "-r", "ts-node/register", "main.js"]
