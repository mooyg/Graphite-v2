export class LoadBalancer {
  private balancer: Balancer[] = []
  constructor({ categoryIds }: ILoadBalancer) {
    categoryIds.forEach((categoryId) => {
      this.balancer = [
        ...this.balancer,
        {
          categoryId: categoryId,
          staffTickets: [],
        },
      ]
    })
  }

  setTicket({ categoryId, ticketId }: ISetTicket) {
    const category = this.balancer.find((balancer) => balancer.categoryId === categoryId)
    if (!category) throw new Error('No category found with that id')

    this.balancer[this.balancer.findIndex((balancer) => balancer.categoryId === categoryId)] = {
      ...category,
      staffTickets: [...category.staffTickets, ticketId],
    }
    return {
      ...category,
      staffTickets: [...category.staffTickets, ticketId],
    }
  }

  getTicketCategory(categoryId: string) {
    return this.balancer.find((balancer) => balancer.categoryId === categoryId)
  }

  get tickets() {
    return this.balancer
  }
}

export interface ILoadBalancer {
  categoryIds: string[]
}

export interface Balancer {
  categoryId: string
  staffTickets: string[] | []
}

export interface ISetTicket {
  categoryId: string
  ticketId: string
}
