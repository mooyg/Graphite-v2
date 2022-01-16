import { Collection } from 'discord.js'
import { remove } from 'lodash'
export class LoadBalancer {
  private balancer: Collection<string, string[]> = new Collection()
  constructor({ categoryIds }: ILoadBalancer) {
    categoryIds.forEach((categoryId) => {
      this.balancer.set(categoryId, [])
    })
  }

  setTicket({ categoryId, ticketId }: ISetTicket) {
    const category = this.balancer.get(categoryId)
    if (!category) throw new Error('No category found with that id')

    this.balancer.set(categoryId, [...category, ticketId])
    return this.balancer.get(categoryId)
  }

  getTicketCategory(categoryId: string) {
    return this.balancer.get(categoryId)
  }

  get tickets() {
    return this.balancer
  }

  lowestTicketCategory() {
    const balancer = [...Array.from(this.balancer)]
    let minCategory = balancer[0]
    for (const [key, value] of balancer) {
      if (value.length < minCategory[1].length) {
        minCategory = [key, value]
      }
    }
    return minCategory
  }

  deleteTicket({ categoryId, ticketId }: { categoryId: string; ticketId: string }) {
    const category = this.balancer.get(categoryId)
    if (category) {
      remove(category, (item) => {
        console.log(item, ticketId)
        return item === ticketId
      })
      this.balancer.set(categoryId, category)
    }
  }
}

export interface ILoadBalancer {
  categoryIds: string[]
}

export interface Balancer {
  categoryId: string
  tickets: string[] | []
}

export interface ISetTicket {
  categoryId: string
  ticketId: string
}
