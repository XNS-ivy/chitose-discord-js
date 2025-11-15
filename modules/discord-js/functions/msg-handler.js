function getMessageType(msg) {
    if (msg.attachments.size > 0) return 'attachment'
    if (msg.stickers.size > 0) return 'sticker'
    if (msg.embeds.length > 0) return 'embed'
    if (msg.reference) return 'reply'
    return 'text'
}

export function parseMessage(msg) {
    return {
        from: msg.author.username,
        userId: msg.author.id,
        serverId: msg.guild?.id || null,
        channelId: msg.channel.id,
        messageId: msg.id,
        timestamp: msg.createdTimestamp,

        message: msg.content,
        messageType: getMessageType(msg),

        // ========== ATTACHMENTS ==========
        attachments: msg.attachments.map(a => ({
            id: a.id,
            url: a.url,
            name: a.name,
            contentType: a.contentType,
            size: a.size,
        })),

        // ========== EMBEDS ==========
        embeds: msg.embeds.map(e => ({
            title: e.title,
            description: e.description,
            url: e.url,
            color: e.color,
            fields: e.fields,
            footer: e.footer,
            image: e.image,
            thumbnail: e.thumbnail,
        })),

        // ========== STICKERS ==========
        stickers: msg.stickers.map(s => ({
            id: s.id,
            name: s.name,
            formatType: s.format,
            url: s.url ?? null,
        })),

        // ========== MENTIONS ==========
        mentions: {
            users: [...msg.mentions.users.values()].map(u => ({
                id: u.id,
                username: u.username
            })),
            roles: [...msg.mentions.roles.values()].map(r => ({
                id: r.id,
                name: r.name
            })),
            channels: [...msg.mentions.channels.values()].map(c => ({
                id: c.id,
                name: c.name
            })),
            everyone: msg.mentions.everyone,
        },

        // ========== REPLY REFERENCE ==========
        reference: msg.reference?.messageId
            ? {
                messageId: msg.reference.messageId,
                channelId: msg.reference.channelId,
                guildId: msg.reference.guildId,
            }
            : null,

        // ========== COMPONENTS (buttons/menu) ==========
        components: msg.components.map(row => ({
            type: row.type,
            components: row.components.map(c => ({
                type: c.type,
                customId: c.customId,
                label: c.label,
                style: c.style,
                value: c.value,
            }))
        })),

        // ========== AUTHOR (expanded) ==========
        author: {
            id: msg.author.id,
            username: msg.author.username,
            avatar: msg.author.displayAvatarURL(),
            isBot: msg.author.bot,
        },

        // ========== CHANNEL INFO ==========
        channel: {
            id: msg.channel.id,
            name: msg.channel.name ?? null,
            type: msg.channel.type,
        },

        // ========== SERVER INFO ==========
        server: msg.guild ? {
            id: msg.guild.id,
            name: msg.guild.name,
            ownerId: msg.guild.ownerId,
        } : null,
    }
}