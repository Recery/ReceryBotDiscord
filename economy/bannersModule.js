const DB = require("better-sqlite3");
const Canvas = require("canvas");
const slimesModule = require("./slimesModule.js");

const banners = [];

function getRegularBannerSlimesIds() {
    const slimesIds = [];

    for (const slime of slimesModule.slimes) {
        if (slime.regularBanner) slimesIds.push(slime.id);
    }

    return slimesIds;
}

function getBanner(name) {
    for (const banner of banners) {
        if (isBannerEnded(banner) && banner.name !== "Regular") {
            removeBanner(banner);
            continue;
        }
        if (banner.name.toLowerCase() === name.toLowerCase()) return banner;
    }

    return null;
}

function setPlayerBanner(userId, bannerName) {
    const banner = getBanner(bannerName);

    if (!banner) return false;

    if (isBannerEnded(banner) && banner.name !== "Regular") {
        removeBanner(banner)
        return false;
    }

    const db = new DB(process.env.DB_DIR + "economy.db");
    db.prepare("INSERT OR REPLACE INTO chosenBanners (userId, bannerName) VALUES (?, ?)")
        .run(userId, bannerName);
    db.close();

    return true;
}

function getPlayerBanner(userId) {
    const db = new DB(process.env.DB_DIR + "economy.db");
    const row = db.prepare("SELECT bannerName FROM chosenBanners WHERE userId = ?").get(userId);
    db.close();
    if (row) {
        const banner = getBanner(row.bannerName);
        if (banner) return banner;
    }
    return banners[0]; // si no tiene banner, devolver el banner regular
}

async function addBanner(name, endDate, slimesIds) {
    console.log(slimesIds);

    // los ids se reciben con un string separados por ;

    if (typeof name !== "string" || name instanceof String) return false;
    if (isNaN(endDate)) return false;
    if (typeof slimesIds !== "string" || slimesIds instanceof String) return false;

    // convertirlos en numeros a los ids
    const idsArr = slimesIds.split(";");
    const numberIds = [];
    for (const id of idsArr)
        numberIds.push(Number(id));

    const imageBuffer = await getBannerImage(name, numberIds);

    // el array de numeros se usa en el array de banners

    banners.push({
        name: name, // string
        endDate: endDate, // numero
        slimesIds: numberIds.push(getRegularBannerSlimesIds()), // array numeros
        imageBuffer: imageBuffer // buffer
    });

    // el string se usa para la base de datos

    const db = new DB(process.env.DB_DIR + "economy.db");
    db.prepare("INSERT OR REPLACE INTO banners (name, endDate, slimesIds) VALUES (?, ?, ?)")
        .run(name, endDate, slimesIds);
    db.close();

    return true;
}

function removeBanner(banner) {
    if (!banner) return false;

    if (!Object.hasOwn(banner, "name")) return false;

    const db = new DB(process.env.DB_DIR + "economy.db");
    db.prepare("DELETE FROM banners WHERE name = ?").run(banner.name);
    db.close();

    const index = banners.indexOf(banner);
    if (index !== -1) banners.splice(index, 1);

    return true;
}

function isBannerEnded(banner) {
    if (!banner) return true;
    if (!Object.hasOwn(banner, "endDate")) return true;

    return banner.endDate < Date.now();
}

let initializedBanners = false;
let startedInitialization = false;
initBanners();
async function initBanners() {
    if (startedInitialization) return;
    startedInitialization = true;

    // primero añadir el banner regular, siempre el mismo
    banners.push({
        name: "Regular",
        endDate: 0, // se le pone 0 porque el banner regular nunca termina
        slimesIds: getRegularBannerSlimesIds(),
        imageBuffer: await getBannerImage("Regular", getRegularBannerSlimesIds())
    });

    const db = new DB(process.env.DB_DIR + "economy.db");
    const rows = db.prepare("SELECT * FROM banners").all();

    for (const row of rows) {
        if (row.endDate < Date.now()) {
            db.prepare("DELETE FROM banners WHERE name = ?").run(row.name);
            continue;
        }

        const slimesIds = [];

        // hacer un array de los string de ids sacado de la base de datos
        const ids = row.slimesIds.split(";");

        // Obtener todos los slimes a partir del string de ids
        for (const id of ids) {
            const slime = slimesModule.getSlime(Number(id));
            if (!slime) continue; // existe el slime?

            slimesIds.push(Number(id));
        }

        const imageBuffer = await getBannerImage(row.name, slimesIds);
        banners.push({
            name: row.name,
            endDate: row.endDate,
            slimesIds: slimesIds.concat(getRegularBannerSlimesIds()), // añadir al final del array, los ids de slimes del banner regular
            imageBuffer: imageBuffer
        });
    }

    db.close();
    initializedBanners = true;
}

async function getBanners() {
    while (!initializedBanners)
        await new Promise((resolve) => setTimeout(resolve, 100));

    //console.log(banners);
    return banners;
}

module.exports = {
    getBanner,
    addBanner,
    getBanners,
    setPlayerBanner,
    getPlayerBanner
}


// -----------------------
// GENERACION DE IMAGENES

async function getBannerImage(name, slimesIds) {
    const canvas = Canvas.createCanvas(1600, 1200);
    const ctx = canvas.getContext('2d');

    ctx.font = "220px silkscreen";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 6;

    const background = await Canvas.loadImage(process.env.FILES_BASE_URL + "slimeImages/background.png");
    // width para la altura tambien, porque quiero que salga cortado el fondo y no se deforme
    ctx.drawImage(background, 0, 0, canvas.width, canvas.width);

    // por defecto usar imagenes del cosmic slime y goldfish slime
    // para el banner regular
    let epicSlime = slimesModule.getSlimeByName("cosmic slime");
    let ultraSlime = slimesModule.getSlimeByName("goldfish slime");

    let epicChoosed = false;
    let ultraChoosed = false;

    for (const id of slimesIds) {
        const slime = slimesModule.getSlime(Number(id));
        if (!slime) continue;

        if (slime.rarity === 3 && !epicChoosed) { // epic
            epicSlime = slime;
            epicChoosed = true;
        } else if (slime.rarity === 4 && !ultraChoosed) { // ultra
            ultraSlime = slime;
            ultraChoosed = true;
        }

        if (!epicChoosed && !ultraChoosed) break;
    }

    const epicImage = await Canvas.loadImage(epicSlime.image);
    const ultraImage = await Canvas.loadImage(ultraSlime.image);

    ctx.drawImage(ultraImage, canvas.width * 0.1, canvas.height * 0.15, 550, 550);
    ctx.drawImage(epicImage, canvas.width * 0.55, canvas.height * 0.15, 550, 550);
        
    ctx.fillText(name, canvas.width / 2, canvas.height * 0.88);
    ctx.strokeText(name, canvas.width / 2, canvas.height * 0.88);

    return canvas.toBuffer();
}