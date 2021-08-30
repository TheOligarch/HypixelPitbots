require("dotenv").config();
const mineflayer = require("mineflayer");
const ws = require("ws");
const pathfinder = require("mineflayer-pathfinder").pathfinder;
const Movements = require("mineflayer-pathfinder").Movements;
const { GoalNear } = require("mineflayer-pathfinder").goals;
async function createMultiple(bots, constructor) {
  const { Worker, isMainThread, workerData } = require("worker_threads");
  if (isMainThread) {
    const threads = [];
    for (const i in bots) {
      await threads.push(
        new Worker(__filename, {
          workerData: bots[i],
        })
      );
    }
  } else {
    constructor(workerData);
  }
}
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
createMultiple(
  ["e1ad5b39", "b854dbab", "4c846ad3", "2dc53541", "395e3f29"],
  async (username) => {
    var ip = process.env.MINECRAFTSERVERIP;
    const bot = await mineflayer.createBot({
      host: ip,
      username: username,
      version: "1.8.9",
    });
    bot.loadPlugin(pathfinder);
    var websocket = new ws("wss://maincontroller:443", {
      rejectUnauthorized: false,
    });
    bot.on("login", async () => {
      bot.setControlState("sprint", true);
    });
    bot.on("chat", async (username, message) => {
      if (message.startsWith("eval")) {
        bot.chat("trying" + message.split("eval ")[1]);
        eval(message.split("eval ")[1]);
      }
    });
    let botting = false;
    var hitLoop;
    var fightLoop = false;
    bot.on("spawn", async () => {
      await clearInterval(hitLoop);
      await bot.pathfinder.stop();
      fightLoop = false;
      await delay(Math.round(Math.random() * 1000));
      const Vec3 = require("vec3").Vec3;
      await bot.lookAt(new Vec3(1, 118, 0));
      await bot.setControlState("jump", true);
      await bot.setControlState("forward", true);
      botting = true;
    });
    // bot.on("death", async () => {
    //   if (hitLoop) {
    //     clearInterval(hitLoop);
    //     bot.pathfinder.stop()
    //   }
    // });

    bot.on("goal_reached", async () => {
      if (fightLoop) return;
      if (!fightLoop) fightLoop = true;

      bot.chat("reached");
      let target = bot.nearestEntity(({ type }) => type === "player");
      async function attack() {
        const Vec3 = require("vec3").Vec3;
        if (target && target.position)
          await bot.lookAt(
            new Vec3(
              target.position.x + Math.random() * 0.253,
              target.position.y + Math.random(),
              target.position.z + Math.random() * 0.253
            )
          );
        await bot._client.write("arm_animation", { hand: 0 });
        if (target && target.id) await bot.attack(target);
      }
      hitLoop = setInterval(async () => {
        if (!target || !target.position) return;
        var distance = target.position.distanceTo(bot.entity.position);
        if (distance < 3) {
          attack();
        } else if (target.position) {
          target = bot.nearestEntity(({ type }) => type === "player");
          if (
            !bot.nearestEntity(
              (entity) =>
                entity.type === "player" &&
                entity.position.distanceTo(bot.entity.position) < 3
            )
          ) {
            await bot.pathfinder.setMovements(
              new Movements(bot, require("minecraft-data")(bot.version))
            );
            if (target && target.position)
              await bot.pathfinder.setGoal(
                new GoalNear(
                  target.position.x,
                  target.position.y,
                  target.position.z,
                  2
                )
              );
            attack();
          }
        }
      }, Math.round(Math.floor(Math.random() * (2103 - 510 + 1)) + 510));
    });
    bot.on("move", async () => {
      if (botting && bot.entity.position.y < 110) {
        if (botting) {
          botting = false;
          // await bot.setControlState("jump", false);
          // await bot.setControlState("forward", false);
          const target = bot.players[process.env.TARGET]
            ? bot.players[process.env.TARGET].entity
            : null;
          if (!target) return bot.chat("I CANNOT SEE YOU");
          bot.pathfinder.setMovements(
            new Movements(bot, require("minecraft-data")(bot.version))
          );
          bot.pathfinder.setGoal(
            new GoalNear(
              target.position.x,
              target.position.y,
              target.position.z,
              2
            )
          );
        }
      }
    });
    bot.on("kicked", console.log);
    bot.on("error", console.log);
    bot.on("leave", console.log);
  }
);
