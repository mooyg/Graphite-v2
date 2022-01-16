import { load } from 'dotenv'
import { LoadBalancer } from '../src/utils/loadBalancing'

const loadBalancer = new LoadBalancer({
  categoryIds: ['00101002010102012', '483439443893484349', '3489234780943342'],
})
beforeEach(() => {})
describe('Test Load Balancer', () => {
  it('Should set the new ticket id to the category it got assigned to', () => {
    const setTicket = loadBalancer.setTicket({
      categoryId: '3489234780943342',
      ticketId: '218783281233923',
    })
    loadBalancer.setTicket({
      categoryId: '00101002010102012',
      ticketId: '29e3228321303283',
    })
    loadBalancer.setTicket({
      categoryId: '483439443893484349',
      ticketId: '32892387324793',
    })
    loadBalancer.setTicket({
      categoryId: '483439443893484349',
      ticketId: '328982749237',
    })

    loadBalancer.setTicket({
      categoryId: '00101002010102012',
      ticketId: '248977482487',
    })

    expect(setTicket).toStrictEqual(loadBalancer.getTicketCategory('3489234780943342'))
  })

  it('Should return the category with lowest tickets', () => {
    expect(loadBalancer.lowestTicketCategory()[0]).toStrictEqual('3489234780943342')
  })
  it('Should delete the ticket from the category', () => {
    loadBalancer.deleteTicket({
      categoryId: '00101002010102012',
      ticketId: '248977482487',
    })
  })
})
