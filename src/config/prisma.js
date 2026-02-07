// Exports the prisma/client object to use for querying to the DB
require('dotenv').config();
const { PrismaPg } = require('@prisma/adapter-pg');
// import { PrismaClient } from '../generated/prisma/client.js'
const { PrismaClient } = require('../../generated/prisma/client.js')

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

module.exports =  prisma;