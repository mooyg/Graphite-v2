export class LoadBalancer {
  private balancer: Balancer[]
  constructor({ categoryIds }: ILoadBalancer) {}

  setTickets({ categoryId, ticketId }: ISetTickets) {
    const category = this.balancer.find((balancer) => balancer.categoryId === categoryId)
    if (!category) throw new Error('No category found with that id')
    this.balancer = [
      ...this.balancer,
      {
        ...category,
        staffTickets: [...category.staffTickets, ticketId],
      },
    ]
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
  staffTickets: string[]
}

export interface ISetTickets {
  categoryId: string
  ticketId: string
}
