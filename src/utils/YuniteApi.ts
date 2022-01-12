import axios from 'axios'
import { config } from 'dotenv'

config()

export class YuniteApi {
  readonly YUNITE_API_TOKEN: string
  constructor({ YUNITE_API_TOKEN }: IYuniteApi) {
    if (!YUNITE_API_TOKEN) throw new Error('No YUNITE TOKEN PROVIDED')
    this.YUNITE_API_TOKEN = YUNITE_API_TOKEN
  }
  async blockUser({ userId, guildId }: IBlockUser): Promise<BlockUser> {
    const { notLinked } = await this.getRegistrationData({
      guildId,
      userId,
    })
    if (notLinked[0] === userId) {
      return {
        statusCode: 404,
      }
    }
    const { data } = await axios.request<{
      status: 'SUCCESS'
      unlinkedFrom: { epicID: string }
    }>({
      method: 'POST',
      url: `https://yunite.xyz/api/v3/guild/${guildId}/registration/blocks`,
      headers: {
        'Y-Api-Token': `${this.YUNITE_API_TOKEN}`,
      },
      data: {
        op: 'BLOCK',
        userType: 'DISCORD',
        userId,
        reason: 'SAQRSCRIMS_COOLDOWN',
        blockedLinkedUser: true,
      },
    })
    if (data.status === 'SUCCESS') {
      return {
        epicId: data.unlinkedFrom.epicID,
        statusCode: 200,
      }
    }
    return {
      statusCode: 400,
    }
  }

  async getRegistrationData({ userId, guildId }: IRegistrationData): Promise<IGetRegistrationData> {
    const { data } = await axios.request<IGetRegistrationData>({
      url: `https://yunite.xyz/api/v3/guild/${guildId}/registration/links`,
      method: 'POST',
      data: {
        type: 'DISCORD',
        userIds: [`${userId}`],
      },
      headers: {
        'Y-Api-Token': `${this.YUNITE_API_TOKEN}`,
      },
    })
    return data
  }

  async unblockUser({ discordId, epicId, guildId }: IUnblockUser): Promise<UnblockUser> {
    const { data: unblockEpicData } = await axios.request<{
      status: 'SUCCESS'
    }>({
      method: 'POST',
      url: `https://yunite.xyz/api/v3/guild/${guildId}/registration/blocks`,
      headers: {
        'Y-Api-Token': `${process.env.YUNITE_API_TOKEN}`,
      },
      data: {
        action: 'UNBLOCK',
        userType: 'EPIC',
        userId: epicId,
      },
    })
    const { data: unblockDiscordData, headers } = await axios.request<{
      status: 'SUCCESS'
    }>({
      method: 'POST',
      url: `https://yunite.xyz/api/v3/guild/${guildId}/registration/blocks`,
      headers: {
        'Y-Api-Token': `${process.env.YUNITE_API_TOKEN}`,
      },
      data: {
        action: 'UNBLOCK',
        userType: 'DISCORD',
        userId: discordId,
      },
    })
    console.log(headers)
    if ((unblockDiscordData && unblockEpicData).status === 'SUCCESS') {
      return {
        statusCode: 200,
      }
    }
    return {
      statusCode: 400,
    }
  }
}

export interface IYuniteApi {
  YUNITE_API_TOKEN: string
}
export interface IRegistrationData {
  userId: string | undefined
  guildId: string | undefined
}
export interface IGetRegistrationData {
  users: User[]
  notLinked: string[]
  notFound: string[]
}
export interface User {
  discord: Discord
  epic: Epic
  dateVerified: string
  chosenPlatform: string
  chosenPeripheral: string
}
export interface Discord {
  id: string
  name: string
  avatar: string
}

export interface Epic {
  epicID: string
  epicName: string
}

interface IBlockUser {
  guildId: string
  userId: string | undefined
}

interface BlockUser {
  statusCode: 404 | 200 | 400
  epicId?: string
}

export interface IUnblockUser {
  discordId: string
  guildId: string
  epicId: string
}

export interface UnblockUser {
  statusCode: 200 | 400
}
