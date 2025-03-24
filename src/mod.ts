import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt/servers/DatabaseServer";

class FpsUnlocker implements IPostDBLoadMod
{
    private modConfig = require("../config/config.json");
    private isFikaInstalled: boolean = false;
    private modName = "[FpsUnlocker]";
    private logger: ILogger;

    postDBLoad(container: DependencyContainer): void
    {
        this.logger = container.resolve<ILogger>("WinstonLogger");
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const tables = databaseServer.getTables();

        try {
            container.resolve("FikaConfig")
            this.isFikaInstalled = true;
            this.logger.info(`${this.modName} Detected FIKA installation - forcing 144fps menu limit.`)
        } catch (e) {
            this.isFikaInstalled = false;
        }

        tables.settings.config.FramerateLimit.MaxFramerateLobbyLimit = this.isFikaInstalled
            ? Number(this.modConfig["framerate"])
            : Number(144)

        tables.settings.config.FramerateLimit.MaxFramerateGameLimit = Number(this.modConfig["framerate"]);

        this.logger.info("[FpsUnlocker] Applied framerate settings.");
    }
}
export const mod = new FpsUnlocker()
