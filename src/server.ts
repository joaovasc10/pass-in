// API REST com Node.js e Fastify que deverá ser consumida por um front-end em React

import fastify from 'fastify';

// zod: biblioteca para validação de dados
import { z } from 'zod';

// importa o prisma orm
import { PrismaClient } from '@prisma/client';

// MÉTODOS HTTP: GET, POST, PUT, DELETE
// Corpo da requisição (Request Body): Dados para criação ou atualização de um registro
// Parâmetros de busca (Search Params / Query Params) 'http://localhost:3333/users?name=Joao'
// Parametros da rota (Route Params) -> Identificar um recurso específico 'DELETE http://localhost:3333/users/5'
// Cabeçalhos (Headers) -> Contexto da requisição, informações adicionais

// Conexão com o banco de dados: Driver nativo / Query Builder / ORMs
// ORM: automação de processos com o banco de dados
// Migrations: versionamento do banco de dados
// Banco da dados: SQLite



// cria uma instância do fastify
const app = fastify();

// cria uma instância do prisma
const prisma = new PrismaClient({
    // retorna um log da query quando for executada
    log: ['query']
});

// rota para a criação de um evento
// request: dados recebidos na requisição
// reply: resposta que será enviada ao cliente
// é uma função async pois a operação de salvar no banco de dados é assíncrona
app.post('/events', async (request, reply) => {

    const createEventSchema = z.object({
        // corpo da requisição

        // título com no mínimo 4 caracteres
        title: z.string().min(4),

        // pode ser nulo
        details: z.string().nullable(),

        // deve ser um inteiro positivo e pode ser nulo
        maximumAttendees: z.number().int().positive().nullable(),
    });

    // parse: faz a validação dos dados
    // verifica se está na mesma estrutura do modelo acima
    const data = createEventSchema.parse(request.body);

    const event = await prisma.event.create({
        data: {
            title: data.title,
            details: data.details,
            maximumAttendees: data.maximumAttendees,
            slug: new Date().toISOString(),
        },
    })

    // retorna o evento criado
    // return { eventID: event.id };

    return reply.status(201).send({ eventID: event.id} );
})

// then: promise que é executado quando o servidor é iniciado
app.listen({ port: 3333}).then(() => {
    console.log('Server is running on port 3333');
});