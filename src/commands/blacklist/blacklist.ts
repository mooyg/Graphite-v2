import { ApplicationCommandRegistry, Command, none, RegisterBehavior } from '@sapphire/framework'
import { milliseconds } from 'date-fns'
import { CommandInteraction, GuildMember } from 'discord.js'
import { userInfo } from 'os'

export class Blacklist extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'blacklist',
      aliases: ['b'],
      description: 'Blacklist a user breaking scrim rules',
      requiredUserPermissions: ['MANAGE_NICKNAMES'],
    })
  }
  public async registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        options: [
          {
            type: 'USER',
            name: 'user',
            description: 'The User you want to blacklist',
            required: true,
          },
          {
            type: 'INTEGER',
            name: 'time',
            description: 'The time you want him to be blacklisted',
            required: true,
          },
        ],
      },
      {
        guildIds: ['565910084354310154'],
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      }
    )
  }
  public async chatInputRun(interaction: CommandInteraction) {
    if (!interaction.inGuild()) return
    await interaction.deferReply()
    const user = interaction.options.get('user')?.member as GuildMember
    const time = interaction.options.get('time')?.value

    const endDate = milliseconds({
      days: Number(time),
    })

    const res = await this.container.yunite.blockUser({
      guildId: interaction.guildId!,
      userId: user?.user.id,
    })
    switch (res?.statusCode) {
      case 404: {
        await interaction.editReply("User isn't linked to any epic account")
        break
      }
      case 200: {
        if (
          await this.container.prisma.blacklistedUser.findFirst({
            where: {
              discordId: user.id,
            },
          })
        )
          return await interaction.editReply('User Already Blacklisted')
        try {
          await this.container.prisma.blacklistedUser.create({
            data: {
              epicId: res.epicId!,
              discordId: user.id as string,
              endDate: Date.now() + endDate,
            },
          })
          const role = interaction.guild?.roles.cache.get('678193711947186208')
          if (!role) return await interaction.editReply('No role found')
          user?.roles.add(role)
          await interaction.editReply(
            `Succesfully Blacklisted <@${user.id}> with epic Id \`${res.epicId}\``
          )
        } catch (e) {
          await interaction.editReply('Some error occured')
        }
        break
      }
      default: {
        interaction.editReply('Sorry No response matched')
      }
    }
  }
}
