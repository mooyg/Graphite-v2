import { container, SapphireClient } from '@sapphire/framework'
import { ClientOptions } from 'discord.js'
import { PrismaClient } from '@prisma/client'
import { YuniteApi } from '../utils/YuniteApi'
import { config } from 'dotenv'
import { LoadBalancer } from '../utils/loadBalancing'
import { ListOfTicketCategories } from '@prisma/client'
config()
export class Client extends SapphireClient {
  constructor(options: ClientOptions) {
    super(options)
  }

  async init(token: string | undefined) {
    const prisma = new PrismaClient()
    container.prisma = prisma
    container.yunite = new YuniteApi({
      YUNITE_API_TOKEN: process.env.YUNITE_API_TOKEN!,
    })

    container.balancer = new LoadBalancer({
      categoryIds: (await prisma.listOfTicketCategories.findMany({})).map(
        (categoryId) => categoryId.categoryId
      ),
    })

    await super.login(token)
  }
}
declare module '@sapphire/pieces' {
  interface Container {
    prisma: PrismaClient
    yunite: YuniteApi
    balancer: LoadBalancer
  }
}
