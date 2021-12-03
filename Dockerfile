#para onde queremos copiar nossa imagem 
#FROM ubuntu

#instala o node no nosso container, já que estamos trabalhando com um app em node...
#RUN apt-get install nodejs

#certas imagens já tem tudo que a gente precisa configurado, utilizar a versão alpine para ele instala só o necessario
FROM node:14.17.6-alpine

#determinando o diretorio onde sera colado os arquivos apos serem copiados
WORKDIR /home/nest-api

#copiar e instala esses arquivos antes de copiar o código evita que tenhamos que instalar todas as dependencias do projeto cada vez que fizermos alguma alteração
COPY package.json .

RUN npm install

#o primeiro ponto indica de onde queremos copiar os arquivos, no caso o ponto representa o direotio atual que é a raiz e todos os arquivos que tem nela, depois o  endereço de onde esses arquivos serão colados no container, no caso esse segundo ponto esta referenciando o WORKDIR se não escrevermos o WORKDIR temos que escrever o endereço na mão
COPY . .


#o comando que queremos executar dentro do nosso container poderia ser npm start, mas como estou usando yarn...
#RUN npm install

#CMD é um comando pra executa o script depois que a gente subir o nosso container
CMD npm run start:dev