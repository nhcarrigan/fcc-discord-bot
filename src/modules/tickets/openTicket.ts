import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChannelType
} from "discord.js";

import { openTicketMessage } from "../../config/TicketMessage.js";
import { ExtendedClient } from "../../interfaces/ExtendedClient.js";
import { errorHandler } from "../../utils/errorHandler.js";

/**
 * Checks if a user has an open ticket. If not, creates a new ticket for them.
 *
 * @param {ExtendedClient} bot The bot's Discord instance.
 * @param {ButtonInteraction} interaction The interaction payload from Discord.
 */
export const openTicket = async (
  bot: ExtendedClient,
  interaction: ButtonInteraction<"cached">
) => {
  try {
    if (!interaction.channel || interaction.channel.isThread()) {
      throw new Error("How did a ticket button end up in a null channel?");
    }
    if (interaction.channel.type !== ChannelType.GuildText) {
      throw new Error("A ticket button in a non-text channel?");
    }
    await interaction.deferReply({ ephemeral: true });
    await interaction.channel.threads.fetch();
    if (
      interaction.channel.threads.cache.find(
        (t) => t.name.includes(interaction.user.id) && !t.archived && !t.locked
      )
    ) {
      await interaction.reply({
        content: "You already have a ticket open.",
        ephemeral: true
      });
    }

    const button = new ButtonBuilder()
      .setCustomId("ticket-close")
      .setLabel("Close Ticket")
      .setEmoji("❌")
      .setStyle(ButtonStyle.Danger);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    const thread = await interaction.channel.threads.create({
      type: ChannelType.PrivateThread,
      name: `ticket-${interaction.user.id}`,
      reason: "Moderation ticket"
    });
    await thread.send({ content: openTicketMessage, components: [row] });
    const ping = await thread.send({
      content: `${interaction.user.toString()} <@&692818623458443316>`
    });
    await ping.delete();
  } catch (err) {
    await errorHandler(bot, "open ticket", err);
  }
};
