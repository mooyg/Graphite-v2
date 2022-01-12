import { load } from 'dotenv'
import { LoadBalancer } from '../src/utils/loadBalancing'

const loadBalancer = new LoadBalancer({
  categoryIds: ['00101002010102012', '483439443893484349', '3489234780943342'],
})
beforeEach(() => {})
describe('Test Load Balancer', () => {
  it('Should set balancer field', () => {
    expect(loadBalancer.tickets).toStrictEqual([
      {
        categoryId: '00101002010102012',
        staffTickets: [],
      },
      {
        categoryId: '483439443893484349',
        staffTickets: [],
      },
      {
        categoryId: '3489234780943342',
        staffTickets: [],
      },
    ])
  })

  it('Should set the new ticket id to the category it got assigned to', () => {
    const setTicket = loadBalancer.setTicket({
      categoryId: '3489234780943342',
      ticketId: '218783281233923',
    })
    console.log(loadBalancer.tickets)
    expect(setTicket).toStrictEqual(loadBalancer.getTicketCategory('3489234780943342'))
  })
})
