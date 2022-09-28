const Discord = require("discord.js");
const bot = new Discord.Client();
const { Client, MessageEmbed } = require("discord.js");
const Canvas = require("canvas");

const main = "1FDCC5";

const cooldown = new Set();
const dailycooldown = new Set();
const robcooldown = new Set();

const ms = require("parse-ms");

const ping = require("minecraft-server-util");
const red = "#fb0000";
const green = "#00fb08";
const yellow = "#FBD100";

const mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "dudu0809",
  database: "economy",
});

con.connect((err) => {
  if (err) throw err;
  console.log("Connected to db");
});

bot.on("ready", () => {
  console.log("Kore is online");

  function pingServers() {
    bot.user
      .setActivity("k!help | " + bot.guilds.cache.size + " servers", {
        type: "PLAYING",
      })
      .catch(console.error);
    setTimeout(pingServers, 30000);
  }
  pingServers();
});

function askForMoney() {
  return Math.floor(Math.random() * (10 - 0 + 1)) + 0;
}

const catgifs = [
  "https://tenor.com/3GKl.gif",
  "https://tenor.com/85uk.gif",
  "https://tenor.com/wxL5.gif",
  "https://tenor.com/yina.gif",
  "https://tenor.com/tzmM.gif",
  "https://tenor.com/YttS.gif",
  "https://tenor.com/bbRde.gif",
  "https://tenor.com/xaLb.gif",
  "https://tenor.com/5sIc.gif",
];

function catGif() {
  var number = Math.floor(Math.random() * (catgifs.length - 0 + 0)) + 0;
  return catgifs[number];
}

function prefix(id) {
  con.query(
    `SELECT * FROM settings WHERE serverid = '${id}'`,
    (err, results) => {
      if (results.length < 1) {
        return "k!";
      } else {
        return results[0].prefix;
      }
    }
  );
}

function findChannel(guildid) {
  con.query(
    `SELECT * FROM settings WHERE serverid = '${guildid}'`,
    (err, results) => {
      if (results[0].welcome_channel == null) {
        return null;
      } else {
        return results[0].welcome_channel;
      }
    }
  );
}

bot.on("guildMemberAdd", async (member) => {
  let newmember = new MessageEmbed()
    .setColor(main)
    .setTitle(`Welcome to ${member.guild.name}, **${member.user.tag}**!`)
    .setDescription(
      "Make sure you read the instructions and rules for the server."
    )
    .setTimestamp();
  await newmember.setThumbnail(member.user.avatarURL());
  con.query(
    `SELECT * FROM settings WHERE serverid = '${member.guild.id}'`,
    (err, results) => {
      if (results[0].welcome_channel == null) {
        return;
      } else {
        let channel1 = results[0].welcome_channel;
        let channel = member.guild.channels.cache.find(
          (ch) => ch.name == `${channel1}`
        );
        if (!channel) {
          console.log("no channel");
        } else {
          channel.send(newmember);
        }
      }
    }
  );
});

function getLogChannel(serverid) {
  con.query(
    `SELECT * FROM settings WHERE serverid = '${serverid}'`,
    (err, results) => {
      if (results[0].logs_channel == null) {
        return;
      } else {
        return results[0].logs_channel;
      }
    }
  );
}

bot.on("guildMemberRemove", async (member) => {
  let leavemember = new MessageEmbed()
    .setColor(main)
    .setTitle(`Goodbye **${member.user.tag}**`)
    .setDescription(
      `We hope you had a good time in ${member.guild}. We're sad to see you go :pensive:`
    )
    .setTimestamp();
  con.query(
    `SELECT * FROM settings WHERE serverid = '${member.guild.id}'`,
    (err, results) => {
      if (results[0].goodbye_channel == null) {
        return;
      } else {
        let channel2 = results[0].goodbye_channel;
        let channel = member.guild.channels.cache.find(
          (ch) => ch.name == `${channel2}`
        );
        if (!channel) {
          console.log("no channel");
        } else {
          channel.send(leavemember);
        }
      }
    }
  );
});

bot.on("message", async (message) => {
  if (message.guild === null) return;
  con.query(
    `SELECT * FROM settings WHERE serverid = '${message.guild.id}'`,
    (err, results) => {
      if (results[0].prefix === null) {
        prefix = "k!";
      } else {
        prefix = results[0].prefix;
      }
    }
  );

  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (!command) {
    message.channel.send(
      `Looks like you don't know your Kore.. did you mean \`${prefix}help\`?`
    );
  }
  if (command == "xp") {
    const Canvas = require("canvas");
    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext("2d");

    const background = await Canvas.loadImage("./kore_bg.png");
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Select the color of the stroke
    ctx.strokeStyle = "#74037b";
    // Draw a rectangle with the dimensions of the entire canvas
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.font = "28px poppins";
    ctx.fillStyle = "#000000";
    ctx.fillText(
      `Welcome to ${member.guild.name},`,
      canvas.width / 2.5,
      canvas.height / 2
    );

    // Add an exclamation point here and below
    //ctx.font = fillText(canvas, `${member.displayName}!`);
    ctx.fillStyle = "#000000";
    ctx.fillText(
      `${member.displayName}!`,
      canvas.width / 2.5,
      canvas.height / 2
    );

    // Pick up the pen
    ctx.beginPath();
    ctx.scale(0.7, 0.7);
    ctx.translate(50, 50);

    // Start the arc to form a circle
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    // Put the pen down

    ctx.closePath();

    // Clip off the region you drew on
    ctx.clip();

    const avatar = await Canvas.loadImage(
      member.user.displayAvatarURL({
        format: "jpg",
      })
    );
    ctx.drawImage(avatar, 25, 25, 200, 200);

    const attachment = new Discord.MessageAttachment(
      canvas.toBuffer(),
      "welcome-image.png"
    );
    con.query(
      `SELECT * FROM settings WHERE serverid = '${member.guild.id}'`,
      (err, results) => {
        if (results[0].welcome_channel == null) {
          return null;
        } else {
          let channel1 = results[0].welcome_channel;
          let channel = member.guild.channels.cache.find(
            (ch) => ch.name == `${channel1}`
          );
          if (!channel) {
            console.log("no channel");
          } else {
            channel.send(`Welcome ${member}`, attachment);
          }
        }
      }
    );
  }
  if (command == "help") {
    const helpembed = new MessageEmbed()
      .setColor(main)
      .setTitle("Kore Bot Help")
      .setDescription(
        "Please react with the following emojis to see its respective help menu."
      )
      .addField("Basic Commands", "⚙️  help, info, stats, etc.")
      .addField("Moderation Commands", "📋  ban, kick, permissions, etc.")
      .addField("Economy Commands", "💰  balance, cashtop, money, etc.")
      .addField("Fun Commands", "🎉  ping, server, gif, etc.");
    const m = await message.channel.send(helpembed);
    await m.react("⚙️");
    await m.react("📋");
    await m.react("💰");
    await m.react("🎉");
    const filter = (reaction, user) => {
      return (
        ["⚙️", "📋", "💰", "🎉"].includes(reaction.emoji.name) &&
        user.id == message.author.id
      );
    };
    const removeReaction = async (m, message, emoji) => {
      try {
        m.reactions
          .find((r) => r.emoji.name == emoji)
          .users.remove(message.author.id);
      } catch (err) {}
    };

    const awaitReactions = async (message, m, filter) => {
      // simplify the use of these options, using destructing^

      m.awaitReactions(filter, {
        max: 1,
      })
        .then(async (collected) => {
          await m.delete();
          const reaction = collected.first();
          if (reaction.emoji.name === "⚙️") {
            await removeReaction(m, message, "⚙️");
            const helpbasic = new MessageEmbed()
              .setColor(main)
              .setTitle("⚙️ Basic Commands | Kore Help Menu")
              .setDescription(
                "Please remember that this bot is in development and that not all commands may be published yet."
              )
              .addField(
                "Commands",
                `\`help\` - Display this menu.\n\`setup\` - Set up Kore for your server.\n\`invite\` - Displays the link to invite Kore to other servers.`
              );
            message.channel.send(helpbasic);
          } else if (reaction.emoji.name === "📋") {
            await removeReaction(m, message, "📋");
            message.channel.send("reacted");
          } else if (reaction.emoji.name === "💰") {
            await removeReaction(m, message, "💰");
            const helpmoney = new MessageEmbed()
              .setColor(main)
              .setTitle("💰 Economy Commands | Kore Help Menu")
              .setDescription(
                "Please remember that this bot is in development and that not all commands may be published yet."
              )
              .addField(
                "Commands",
                `\`bal/balance\` - Display how much money is in your bank.\n\`daily\` - Receive your daily money reward.\n\`beg\` - In times of despair, turn to Kore for financial help.\n\`rob {user}\` - Watch out for the police! 🚓\n\`cashtop\` - Display money rankings for your server.`
              );
            message.channel.send(helpmoney);
          } else if (reaction.emoji.name === "🎉") {
            await removeReaction(m, message, "🎉");
            const helpfun = new MessageEmbed()
              .setColor(main)
              .setTitle("🎉 Fun Commands | Kore Help Menu")
              .setDescription(
                "Please remember that this bot is in development and that not all commands may be published yet."
              )
              .addField(
                "Commands",
                `\`ping\` - .. Pong? Test your connection.\n\`catgif\` - Meow!\n\`server {ip}\` - Displays the status of desired Minecraft server.`
              );
            message.channel.send(helpfun);
          } else {
            message.channel.send("not reacted");
          }
        })
        .catch(() => {});
    };

    awaitReactions(message, m, filter);
  }

  if (command == "setup") {
    con.query(
      `SELECT * FROM settings WHERE serverid = ${message.guild.id}`,
      (err, results) => {
        if (results.length < 1) {
          con.query(
            `INSERT INTO settings (serverid) VALUES('${message.guild.id}')`
          );
        }
        if (!message.member.hasPermission("ADMINISTRATOR")) {
          message.channel.send("You need administrator to run this command.");
        } else {
          if (!args.length || args[0] == "") {
            let setupembed = new MessageEmbed()
              .setColor(main)
              .setTitle(`Welcome to the Kore Server Setup`)
              .setDescription(
                `Setup for **${message.guild.name}** executed by **${message.author.tag}**`
              )
              .addField(
                "Instructions",
                "This server is ready to begin setting up Kore. For each desired feature, execute the respective message listed below."
              )
              .addField(
                "Commands",
                `\`setup prefix\` - Change the bot's prefix.\n\`setup entrance\` - Set up a channel for welcome messages.\n\`setup exit\` - Set up a channel for goodbye messages.\n\`setup logs\` - Set up a channel for log messages.\n\`setup chat\` - Set up chat moderation for your server.`
              );
            if (!err) {
              message.channel.send(setupembed);
            } else {
              console.log(err);
            }
          } else if (args[0] == "prefix") {
            message.channel.send(
              `What should my prefix be? (Current is **${prefix}**, default is k!) - **must be shorter than 5 characters**.`
            );
            const filter = (m) => m.author.id === message.author.id;
            message.channel
              .awaitMessages(filter, {
                max: 1,
                time: 60000,
              })
              .then(async (collected) => {
                if (collected.first().content.length < 5) {
                  con.query(
                    `UPDATE settings set prefix = '${
                      collected.first().content
                    }' WHERE serverid = '${message.guild.id}'`
                  );
                  message.channel.send(
                    `Success! Prefix changed to **${
                      collected.first().content
                    }**`
                  );
                  message.guild.me.setNickname(
                    `(${collected.first().content}) Kore`
                  );
                } else {
                  message.channel.send(`Prefix is too long!`);
                }
                console.log("collected :" + collected.first().content);
              })
              .catch(() => {
                message.reply("You took too long to respond! Setup cancelled.");
              });
          } else if (args[0] == "exit") {
            message.channel.send(
              `Where should goodbye messages (from when a user leaves the server) go? List the name of the channel. For example, I want goodbye messages to go to #exit, so I would reply with "exit". (Current is **#${results[0].goodbye_channel}**, default is none) - **must already be created and existing in the server**.`
            );
            const filter = (m) => m.author.id === message.author.id;
            message.channel
              .awaitMessages(filter, {
                max: 1,
                time: 60000,
              })
              .then(async (collected) => {
                if (
                  message.guild.channels.cache.find(
                    (channel) => channel.name == collected.first().content
                  )
                ) {
                  con.query(
                    `UPDATE settings set goodbye_channel = '${
                      collected.first().content
                    }' WHERE serverid = '${message.guild.id}'`
                  );
                  message.channel.send(
                    `Success! Goodbye channel changed to **#${
                      collected.first().content
                    }**`
                  );
                } else {
                  message.channel.send("Channel is invalid or does not exist!");
                }
                console.log("collected : " + collected.first().content);
              })
              .catch(() => {
                message.reply("You took too long to respond! Setup cancelled.");
              });
          } else if (args[0] == "logs") {
            if (results[0].logs_channel == null) {
              message.channel.send(
                `Where should log messages (such as user kick notifications) go? List the name of the channel. For example, I want log messages to go to #logs, so I would reply with "logs". (Current is **none set**, default is none) - **must already be created and existing in the server**.`
              );
            } else {
              message.channel.send(
                `Where should log messages (such as user kick notifications) go? List the name of the channel. For example, I want log messages to go to #logs, so I would reply with "logs". (Current is **#${results[0].logs_channel}**, default is none) - **must already be created and existing in the server**.`
              );
            }
            const filter = (m) => m.author.id === message.author.id;
            message.channel
              .awaitMessages(filter, {
                max: 1,
                time: 60000,
              })
              .then(async (collected) => {
                if (
                  message.guild.channels.cache.find(
                    (channel) => channel.name == collected.first().content
                  )
                ) {
                  con.query(
                    `UPDATE settings set logs_channel = '${
                      collected.first().content
                    }' WHERE serverid = '${message.guild.id}'`
                  );
                  message.channel.send(
                    `Success! Logs channel changed to **#${
                      collected.first().content
                    }**`
                  );
                } else {
                  message.channel.send("Channel is invalid or does not exist!");
                }
                console.log("collected : " + collected.first().content);
              })
              .catch(() => {
                message.reply("You took too long to respond! Setup cancelled.");
              });
          } else if (args[0] == "entrance") {
            message.channel.send(
              `Where should welcome messages (from when a new user joins the server) go? List the name of the channel. For example, I want welcome messages to go to #entrance, so I would reply with "entrance". (Current is **#${results[0].welcome_channel}**, default is none) - **must already be created and existing in the server**.`
            );
            const filter = (m) => m.author.id === message.author.id;
            message.channel
              .awaitMessages(filter, {
                max: 1,
                time: 60000,
              })
              .then(async (collected) => {
                if (
                  message.guild.channels.cache.find(
                    (channel) => channel.name == collected.first().content
                  )
                ) {
                  con.query(
                    `UPDATE settings set welcome_channel = '${
                      collected.first().content
                    }' WHERE serverid = '${message.guild.id}'`
                  );
                  message.channel.send(
                    `Success! Welcome channel changed to **#${
                      collected.first().content
                    }**`
                  );
                } else {
                  message.channel.send(`Channel is invalid or does not exist!`);
                }
                console.log("collected :" + collected.first().content);
              })
              .catch(() => {
                message.reply("You took too long to respond! Setup cancelled.");
              });
          }
        }
      }
    );
  }

  if (command == "cashtop") {
    con.query("SELECT * FROM balance ORDER BY amt DESC", (err, results) => {
      if (results.length > 1) {
        var cashtop = new MessageEmbed()
          .setColor(main)
          .setTitle(`💰  Money Leaderboard for ${message.guild}`)
          .setDescription(`Bank balance rankings in this server`);
        let r = 0;
        let guild = bot.guilds.cache.get(`${message.guild}`);
        for (i = 0; i <= results.length - 1; i++) {
          if (i > 5) break;
          r++;
          if (message.guild.member(`${results[`${i}`].id}`)) {
            cashtop.addField(
              `🎖️   **${r}.** ${
                message.guild.members.cache.get(`${results[`${i}`].id}`).user
                  .username
              }`,
              `**$${results[`${i}`].amt}** in bank`
            );
          } else {
            r = r - 1;
            continue;
          }
        }
        message.channel.send(cashtop);

        if (err) throw err;
      } else {
        message.channel.send(
          "Error: Only 1 or less people have interacted with Kore! No leaderboard to display."
        );
      }
      //   }
    });
  }
  con.query(
    `SELECT * FROM balance WHERE id = ${message.author.id}`,
    (err, results) => {
      var welcomegift = askForMoney();
      if (results.length >= 1) {
        var bal = results[0].amt;

        if (command == "bal" || command == "balance") {
          message.channel.send(
            `💰 ${message.author.username}, you have **$${bal}** in your bank.`
          );
        } else if (command == "daily") {
          if (dailycooldown.has(message.author.id)) {
            message.channel.send(
              "Oh no Spaghetti-O's! You can only claim the daily reward **once per day**. Please try again in 24 hours!"
            );
          } else {
            con.query(
              `UPDATE balance SET amt = ${bal + 50} WHERE id = '${
                message.author.id
              }'`
            );
            message.channel.send(
              `💰 Here's your daily bonus of **$50**, ${message.author.username}!`
            );
            dailycooldown.add(message.author.id);
            setTimeout(() => {
              cooldown.delete(message.author.id);
            }, 86400000);
          }
        }
      } else {
        if (command == "bal" || command == "balance") {
          message.channel.send(
            `${message.author.username}, you have no money in your bank!`
          );
        } else if (command == "daily") {
          con.query(
            `INSERT INTO balance (id, amt) VALUE ('${
              message.author.id
            }', ${100})`
          );
          message.channel.send(
            "💵 Hi " +
              message.author.username +
              ", here's a little welcome gift of **$100** for your first interaction with Kore!"
          );
        }
      }
      if (command == "rob") {
        const taggedUser = message.mentions.users.first();
        if (results.length === 0) {
          message.channel.send(
            "💵 Uh oh! A new user wants to rob someone! That's not good, is it? Your welcome gift has been halved attempting a bankrob.. enjoy your **$50**."
          );
        } else {
          if (!args.length) {
            message.channel.send("Pick someone to rob, silly!");
          } else if (taggedUser) {
            if (taggedUser.id == message.author.id) {
              message.channel.send(
                "You can't rob yourself! That's kinda sad that you want to ngl."
              );
            } else if (taggedUser.id == "750069502355439827") {
              message.channel.send(
                "What are you thinking, trying to rob Kore? Shame on you"
              );
            } else if (robcooldown.has(message.author.id)) {
              message.channel.send(
                "Hold up! You can only rob someone once every **10 minutes**."
              );
            } else {
              robcooldown.add(message.author.id);
              setTimeout(() => {
                robcooldown.delete(message.author.id);
              }, 600000);
              let robbeduser = message.mentions.users.first();
              var robchance = Math.floor(Math.random() * (5 - 0 + 1)) + 0;
              if (robchance == 1) {
                if (Math.floor(Math.random() * (1 - 0 + 1)) + 0 == 1) {
                  message.channel.send(
                    "🚓 Police see you robbing an innocent user. You run away and manage not to get caught, but no money was stolen in the process."
                  );
                } else {
                  message.channel.send(
                    `🏦 ${robbeduser.username} sees you trying to stealing money from their bank and calls the police. You run away, but the robbery was a failure.`
                  );
                }
              } else if (robchance == 2) {
                message.channel.send(
                  "🚓 Police see your attempted robbery and arrest you, charging a **$100** fee."
                );
                if (bal >= 100) {
                  con.query(
                    `UPDATE balance SET amt = ${bal - 100} WHERE id = ${
                      message.author.id
                    }`
                  );
                } else {
                  con.query(
                    `UPDATE balance SET amt = ${0} WHERE id = ${
                      message.author.id
                    }`
                  );
                }
              } else {
                con.query(
                  `SELECT * FROM balance WHERE id = ${robbeduser.id}`,
                  (err, result) => {
                    if (
                      (result.length < 1) |
                      !result.length |
                      (result.length == 0)
                    ) {
                      message.channel.send(
                        "❌ You picked the wrong person to rob! This user has no money in their bank."
                      );
                    } else if (err | (result[0].amt == 0)) {
                      message.channel.send(
                        "❌ You picked the wrong person to rob! This user has no money in their bank."
                      );
                    } else {
                      var robbedamt =
                        Math.floor(Math.random() * (result[0].amt - 1 + 1)) + 1;
                      con.query(
                        `UPDATE balance SET amt = ${
                          result[0].amt - robbedamt
                        } WHERE id = ${robbeduser.id}`
                      );
                      con.query(
                        `UPDATE balance SET amt = ${
                          bal + robbedamt
                        } WHERE id = ${message.author.id}`
                      );
                      message.channel.send(
                        `💰 Success! Robbed **$${robbedamt}** from **${robbeduser.username}**.`
                      );
                    }
                  }
                );
              }
            }
          } else {
            message.channel.send("Please mention a user to rob!");
          }
        }
      }
      if (command == "beg") {
        if (err) throw err;
        var welcomegift = askForMoney();
        if (results.length === 0) {
          con.query(
            `INSERT INTO balance (id, amt) VALUE ('${
              message.author.id
            }', ${100})`
          );
          if (!err)
            message.channel.send(
              "💵 Hi " +
                message.author.username +
                ", here's a little welcome gift of **$100** for your first interaction with Kore!"
            );
        } else {
          if (cooldown.has(message.author.id)) {
            message.channel.send(
              "Hold on! Please wait 1 minute before collecting your money!"
            );
          } else {
            con.query(
              `UPDATE balance SET amt = ${welcomegift + bal} WHERE id = '${
                message.author.id
              }'`
            );
            if (!err) {
              if (welcomegift == 0) {
                message.channel.send(
                  `Uh oh ${message.author.username}, no one has come to grant you money! Better luck next time!`
                );
              } else {
                message.channel.send(
                  `💸 Kore has blessed ${message.author.username} with **$${welcomegift}**. 💸`
                );
              }
              cooldown.add(message.author.id);
              setTimeout(() => {
                cooldown.delete(message.author.id);
              }, 60000);
            } else {
              console.log(err);
            }
          }
        }
      }
    }
  );
});

bot.on("message", (message) => {
  if (message.guild === null) {
    return;
  } else {
    con.query(
      `SELECT * FROM settings WHERE serverid = '${message.guild.id}'`,
      (err, results) => {
        if (results[0].prefix === null) {
          prefix = "k!";
        } else {
          prefix = results[0].prefix;
        }
      }
    );

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    con.query(
      `SELECT * FROM leveling WHERE id = '${message.author.id}'`,
      (err, results) => {
        if (results.length < 1) {
          con.query(
            `INSERT INTO leveling id,xp VALUES('${message.author.id}', '1')`
          );
        } else {
          var randomxp = Math.random() * (3 - 1) + 1;
          let xpbal = results[0].xp;
          con.query(
            `UPDATE leveling SET xp = ${randomxp + xpbal} WHERE id = '${
              message.author.id
            }'`
          );
        }
      }
    );

    function isInt(value) {
      var x;
      if (isNaN(value)) {
        return false;
      }
      x = parseFloat(value);
      return (x | 0) === x;
    }

    if (command == "server" && args.length) {
      function serverStatus(server) {
        ping(server, 25565)
          .then((response) => {
            const hypixelembed = new MessageEmbed()
              .setTitle("Server Status")
              .setColor(green)
              .setDescription(`**${server}** is **online**`)
              .addField("Online Players", response.onlinePlayers);

            message.channel.send(hypixelembed);
          })
          .catch((err) => {
            const hypixelembedoffline = new MessageEmbed()
              .setTitle("Server Status")
              .setColor(red)
              .addField(
                "Server Offline",
                "IP is either invalid or server is down. Check back later"
              );
            message.channel.send(hypixelembedoffline);
          });
      }

      serverStatus(args[0]);
    } else if (command == "mcserver" && !args.length) {
      const serverargserror = new MessageEmbed()
        .setColor(main)
        .setTitle("Error")
        .addField("Please specify a server", "e.g. mc.hypixel.net");
      message.channel.send(serverargserror);
    } else if (command == "ping") {
      var pingval = bot.ws.ping;
      var pingembed = new MessageEmbed()
        .setTitle(message.author.username + "'s Ping   :ping_pong:")
        .setDescription("Pong! " + bot.ws.ping + " ms");
      if (pingval < 60) {
        pingembed.setColor(green);
      } else if (pingval > 60 && pingval <= 120) {
        pingembed.setColor(yellow);
      } else if (pingval > 120) {
        pingembed.setColor(red);
      }

      message.channel.send(pingembed);
    }
    if (command == "join" && message.author.id == "350823358977277959") {
      bot.emit("guildMemberAdd", message.member);
    }
    if (command == "leave" && message.author.id == "350823358977277959") {
      bot.emit("guildMemberRemove", message.member);
    }
    if (command == "ban" && message.author.id == "350823358977277959") {
      bot.emit("guildBanAdd", message.member);
    }
    if (command == "server") {
      let member = guild.member(message.author);
      let nickname = member ? member.displayName : null;
      let serverstats = new MessageEmbed()
        .setColor(main)
        .setTitle(`Server Stats for **${message.guild.name}**`)
        .addField("Owner", `${message.guild.owner.user.tag}`)
        .addField("Created At", `${message.guild.createdAt}`)
        .addField(
          "Members",
          `**${message.guild.memberCount}** total \`(${
            message.guild.members.cache.filter((member) => !member.user.bot)
              .size
          } users\`, \`${
            message.guild.members.cache.filter((member) => member.user.bot).size
          } bots\`)`
        )
        .addField("Region", message.guild.region)
        .addField("Roles", message.guild.roles.cache.size)
        .addField("Joined At", message.member.joinedAt)
        .setThumbnail(message.guild.iconURL());

      message.channel.send(serverstats);
    }

    if (command == "info") {
      let userinfo = new MessageEmbed()
        .setColor(main)
        .setTitle(`User Info for **${message.author.tag}**`)
        .setDescription(`Nickname for ${message.guild.name}: **${nickname}`);
    }

    if (command == "invite") {
      const inviteembed = new MessageEmbed()
        .setColor(main)
        .setTitle("Click me to invite Kore")
        .setURL(
          "https://discord.com/oauth2/authorize?client_id=750069502355439827&scope=bot&permissions=8"
        )
        .setDescription("Invite Kore to other Discord servers.")
        .addField(
          "**IMPORTANT!**",
          "You must have the *Manage Server* permission in desired server to be able to invite the bot. If you are the server owner, do not worry about this."
        );

      message.channel.send(inviteembed);
    } else if (command == "catgif") {
      message.channel.send(catGif());
    }
  }
});

bot.login("token");
