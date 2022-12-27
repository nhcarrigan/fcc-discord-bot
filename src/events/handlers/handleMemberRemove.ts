import { EmbedBuilder } from "@discordjs/builders";
import { GuildMember, PartialGuildMember } from "discord.js";

import { Camperbot } from "../../interfaces/Camperbot";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Logs a message to the debug hook when someone leaves the server.
 *
 * @param {Camperbot} Bot The bot's Discord instance.
 * @param {GuildMember | PartialGuildMember} member The member that left the server.
 */
export const handleMemberRemove = async (
  Bot: Camperbot,
  member: GuildMember | PartialGuildMember
) => {
  try {
    if (!member.user) {
      return;
    }
    const embed = new EmbedBuilder();
    embed.setTitle("Member Joined");
    embed.setDescription("A member has left the server~!");
    embed.addFields([
      {
        name: "Roles",
        value:
          member.roles?.cache.map((role) => role.name).join(", ") || "unknown",
      },
    ]);
    embed.setAuthor({
      name: member.user.tag,
      iconURL: member.user.displayAvatarURL(),
    });
    embed.setFooter({
      text: `ID: ${member.id}`,
    });
    await Bot.config.welcome_hook.send({
      embeds: [embed],
    });
  } catch (err) {
    await errorHandler(Bot, err);
  }
};
