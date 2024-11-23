import { createBot, createProvider, createFlow, addKeyword, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { RateLimiter } = require('limiter');

const PORT = process.env.PORT ?? 3000

let selectedCity = '';

const welcomeFlow = addKeyword(EVENTS.WELCOME)
    .addAnswer([
        '¡Bienvenido!, te comunicas con el *Bot* 🤖  automático de la Cooperativa Crediscol ¿En qué trámite puedo ayudarte?',
        'Escribe *1* para obtener información sobre *afiliaciones*.',
        'Escribe *2* para obtener información sobre *solicitudes de créditos*.',
        'Escribe *3* para obtener información sobre *devoluciones de aportes*.',
        'Escribe *4* para obtener información sobre *estados de cuenta*.',
        'Escribe *5* para obtener información sobre *desafiliaciones*.',
        'Escribe *6* para obtener información sobre *trámites por fallecimiento*.',
        'Escribe *7* para obtener información sobre *auxilios*.',
        'Escribe *8* para obtener información sobre *paz y salvo*.',
        'Escribe *9* para obtener información sobre *otros servicios*.',
    ])

const planesFlow = addKeyword(['1'])
    .addAnswer([
        '¿Dónde te encuentras?',
        'Escribe *Bogotá* o *Calarcá* para ver las ubicaciones en las que Redetek tiene cobertura.'
    ])

const bogotaFlow = addKeyword(['Bogotá', 'Bogota', 'bogota', 'bogotá'])
    .addAnswer('Estos son los barrios en los que tenemos cobertura para *Bogotá*:', null, (ctx) => {
        selectedCity = 'Bogotá';
    })
    .addAnswer([
        'ACAPULCO', 'ALCAZARES', 'BELLAVISTA', 'BONANZA', 'BOYACA', 'BOYACÁ',
        'BOSQUE POPULAR', 'CLARITA', 'CONSOLACION', 'CONSOLACIÓN', 'DORADO NORTE',
        'EL PASEO', 'ENCANTO', 'ESTRADA', 'ESTRADITA', 'EUROPA',
        'GAITAN', 'GAITÁN', 'ISABELLA', 'JUAN XXIII', 'LA AURORA', 'LA CABAÑA',
        'LA LIBERTAD', 'LA RELIQUIA', 'LAS FERIAS', 'LAUREL', 'LUJAN',
        'ONCE DE NOVIEMBRE', 'PALO BLANCO', 'REAL', 'SAN FERNANDO',
        'SANTA HELENITA', 'SANTA MARIA DEL LAGO', 'SANTA SOFIA', 'SANTA SOFÍA',
        'SIMON BOLIVAR', 'SIMÓN BOLIVAR', 'SOLEDAD NORTE', 'STA ISABEL', 'TABORA',
        'VILLA LUZ', 'FRAGUITA', 'BALVANERA', 'EDUARDO SANTOS',
        'FRAGUA', 'POLICARPA', 'PROGRESO-BOYACA', 'PROGRESO', 'PROGRESO-BOYACÁ', 'RESTREPO',
        'SAN ANTONIO', 'SEVILLA', 'VERGEL', 'VOTO NACIONAL', 'SOLEDAD NORTE PARWEY',
        '\nPor favor, escribe el nombre de tu barrio.'
    ])

const calarcaFlow = addKeyword(['Calarca', 'calarca', 'Calarcá', 'calarcá'])
    .addAnswer('Estos son los barrios en los que tenemos cobertura para *Calarcá*:', null, (ctx) => {
        selectedCity = 'Calarcá';
    })
    .addAnswer([
        'ANTONIA SANTOS', 'ANTONIO NARIÑO', 'AVENIDA COLON', 'AVENIDA COLÓN', 'BALCONES DE LA VILLA',
        'BALCONES VIEJO', 'BOSQUES DE LA BELLA', 'BUENA VISTA', 'CAFETEROS',
        'CALDAS', 'CENTRO', 'CRISTO REY', 'DIVINO NIÑO', 'ECOMAR', 'EL BOSQUE',
        'GAITAN', 'GUADUALES', 'HUERTA', 'JARDIN', 'JARDÍN', 'LA BELLA', 'LA FLORESTA',
        'LA GRAN VIA', 'LA GRAN VÍA', 'LA ISLA', 'LA PISTA', 'LA PLAYITA', 'LAS AGUAS',
        'LAS PALMAS', 'MANANTIAL', 'MIRADOR DE GUADUALES', 'MONTECARLO',
        'NARANJAL', 'OSCAR TOBON', 'OSCAR TOBÓN', 'PINAR', 'PLAZUELAS DE LA VILLA',
        'PORTAL DE BALCONES', 'PORVENIR', 'PRADERA ALTA', 'PRIMAVERA',
        'RECUERDO', 'SANTA LUISA DE', 'FINCA LA ESPERANZA', 'ASOMECA',
        'CAMELIAS 2', 'FERIAS', 'LAURELES', 'LUIS CARLOS GALAN', 'LUIS CARLOS GALÁN',
        'MARIANO OSPINA', 'MILCIADES SEGURA', 'POPULAR', 'SAN BERNANDO', 'SIMON BOLIVAR',
        'SIMÓN BOLIVAR', 'TERRAQUIMBAYA', 'TERRAZAS DE BUENA VISTA',
        'VALDEPENA', 'VARSOVIA', 'VERACRUZ', 'VILLA ASTRID CAROLINA',
        'VILLA GRANDE', 'VILLA ITALIA', 'VILLA JAZMIN', 'VILLA JAZMÍN','VILLA TATIANA',
        'VILLAS DEL CAFE', 'VILLAS DEL CAFÉ', 'VIRGINIA', 'PRADERA BAJA',
        '\nPor favor, escribe el nombre de tu barrio.'
    ])

const barriosEspecialesBogotaFlow = addKeyword(['voto nacional', 'soledad norte parwey'])
    .addAnswer([
        'Estos son los planes disponibles para ti:',
        '100 MEGAS por $92.000',
        '300 MEGAS PLUS BANDA ANCHA por $112.000',
        '500 MEGAS PLUS por $159.000',
        '\nSi estás interesado en alguno de los planes, escribe *contratar*',
        'Si deseas ver las condiciones del servicio, escribe *condiciones*'
    ])

const barriosEspecialesCalarca = addKeyword(['virginia', 'mariano ospina', 'cafeteros', 'divino niño', 'ferias', 'antonio nariño', 'pradera baja', 'cristo rey'])
    .addAnswer([
        'Estos son los planes disponibles para ti:',
        '50 MEGAS por $40.000',
        '100 MEGAS por $50.000',
        '150 MEGAS por $60.000',
        '\nSi estás interesado en alguno de los planes, escribe *contratar*',
        'Si deseas ver las condiciones del servicio, escribe *condiciones*'
    ])

const barriosBogota = addKeyword(['ACAPULCO', 'ALCAZARES', 'BELLAVISTA', 'BONANZA', 'BOYACA', 'BOYACÁ',
    'BOSQUE POPULAR', 'CLARITA', 'CONSOLACION', 'CONSOLACIÓN', 'DORADO NORTE',
    'EL PASEO', 'ENCANTO', 'ESTRADA', 'ESTRADITA', 'EUROPA',
    'GAITAN', 'GAITÁN', 'ISABELLA', 'JUAN XXIII', 'LA AURORA', 'LA CABAÑA',
    'LA LIBERTAD', 'LA RELIQUIA', 'LAS FERIAS', 'LAUREL', 'LUJAN',
    'ONCE DE NOVIEMBRE', 'PALO BLANCO', 'REAL', 'SAN FERNANDO',
    'SANTA HELENITA', 'SANTA MARIA DEL LAGO', 'SANTA SOFIA', 'SANTA SOFÍA',
    'SIMON BOLIVAR', 'SIMÓN BOLIVAR', 'SOLEDAD NORTE', 'STA ISABEL', 'TABORA',
    'VILLA LUZ', 'FRAGUITA', 'BALVANERA', 'EDUARDO SANTOS',
    'FRAGUA', 'POLICARPA', 'PROGRESO-BOYACA', 'PROGRESO', 'PROGRESO-BOYACÁ', 'RESTREPO',
    'SAN ANTONIO', 'SEVILLA', 'VERGEL'])
    .addAnswer('Si eres persona natural, escribe *natural* y si eres persona juridica escribe *juridica*')

const barriosCalarca = addKeyword(['ANTONIA SANTOS', 'AVENIDA COLON', 'AVENIDA COLÓN', 'BALCONES DE LA VILLA',
    'BALCONES VIEJO', 'BOSQUES DE LA BELLA', 'BUENA VISTA',
    'CALDAS', 'CENTRO', 'ECOMAR', 'EL BOSQUE', 'GAITAN', 'GAITÁN', 'GUADUALES', 'HUERTA', 'JARDIN', 'JARDÍN', 'LA BELLA', 'LA FLORESTA',
    'LA GRAN VIA', 'LA GRAN VÍA', 'LA ISLA', 'LA PISTA', 'LA PLAYITA', 'LAS AGUAS',
    'LAS PALMAS', 'MANANTIAL', 'MIRADOR DE GUADUALES', 'MONTECARLO',
    'NARANJAL', 'OSCAR TOBON', 'PINAR', 'PLAZUELAS DE LA VILLA',
    'PORTAL DE BALCONES', 'PORVENIR', 'PRADERA ALTA', 'PRIMAVERA',
    'RECUERDO', 'SANTA LUISA DE', 'FINCA LA ESPERANZA', 'ASOMECA',
    'CAMELIAS 2', 'LAURELES', 'LUIS CARLOS GALAN', 'LUIS CARLOS GALÁN', 'MILCIADES SEGURA', 'POPULAR', 'SAN BERNANDO',
    'SIMÓN BOLIVAR', 'SIMON BOLIVAR', 'TERRAQUIMBAYA', 'TERRAZAS DE BUENA VISTA',
    'VALDEPENA', 'VARSOVIA', 'VERACRUZ', 'VILLA ASTRID CAROLINA',
    'VILLA GRANDE', 'VILLA ITALIA', 'VILLA JAZMIN', 'VILLA JAZMÍN', 'VILLA TATIANA',
    'VILLAS DEL CAFE', 'VILLAS DEL CAFÉ'])
    .addAnswer([
        'Estos son los planes disponibles para ti:',
        '10 MEGAS por $40.000',
        '15 MEGAS por $50.000',
        '30 MEGAS por $60.000',
        '\nSi estás interesado en alguno de los planes, escribe *contratar*',
        'Si deseas ver las condiciones del servicio, escribe *condiciones*'
    ])

const personaNaturalBogotaFlow = addKeyword(['natural', 'Natural'])
    .addAnswer([
        'Si eres *Persona Natural* en Bogotá, estos son los planes disponibles para ti:',
        'TV e Internet Fibra Optica 200 Megas por $65.000',
        'TV e Internet 300 Megas por $75.000',
        'TV e Internet 400 Megas por $85.000',
        'TV e Internet 500 Megas por $95.000',
        '\nSi estás interesado en alguno de los planes, escribe *contratar*',
        'Si deseas ver las condiciones del servicio, escribe *condiciones*'
    ])

const personaJuridicaBogotaFlow = addKeyword(['jurídica', 'juridica', 'Jurídica', 'Juridica'])
    .addAnswer([
        'Si eres *Persona Jurídica* en Bogotá estos son los planes disponibles para ti:',
        '100 MEGAS por $92.000',
        '300 MEGAS PLUS BANDA ANCHA por $112.000',
        '500 MEGAS PLUS por $159.000',
        '\nSi estás interesado en alguno de los planes, escribe *contratar*',
        'Si deseas ver las condiciones del servicio, escribe *condiciones*'
    ])

const oficinasFlow = addKeyword(['Oficinas', 'oficinas'])
    .addAnswer([
        'Estas son nuestras oficinas en *Bogotá*:',
        'San fernando Cra 58# 73-12',
        'La Estrada Cll 66 #69p 39',
        'Boyacá Real Cll 69a # 74a 21',
        'Fraguita  Cra 24 #7 - 49sur',
        '\nY esta es nuestra oficina en *Calarcá*:',
        'Av colon # 26-33'
    ])

const contratarFlow = addKeyword(['contratar', 'Contratar'])
    .addAnswer([
        'Debes acercarte a la oficina más cercana con una copia de tu cedula y una de un recibo público donde se evidencie la dirección exacta a instalar para la validación del costo de instalación, el cual puede costar entre $0 a $90.000 pesos',
        'Si deseas ver la dirección de la oficina más cercana a ti, escribe *oficinas*',
        'Si deseas ver las condiciones del servicio, escribe *condiciones*'
    ])

const condicionesFlow = addKeyword(['Condiciones', 'condiciones'])
    .addAnswer([
        'Todos los planes cuentan con clausula de permanencia de 1 (un) año.',
        'Se firma contrato a comodato frente al modem, el cual deben reintegran al finalizar el contrato.',
        'La TV en señal analoga (TVs basicos que no cuentan con la TDT) sintoniza actualmente 54 canales y en señal digital (TVs que cuentan con la TDT incorporada) más de 130 canales.',
        'El servicio de solo TV tiene un costo de 38.000 y contiene los mismos canales con cableado completamente nuevo, si en la vivienda existe una cometida ya montada en estado útil se brinda la señal por ese mismo medio de hasta 4 TVs por el mismo costo; Si este cableado no es útil debe cancelar derivaciones por punto con un costo de 20.000, son permitidos máximo 4 TVs por esa tarifa, si supera esa cantidad se evalua una tarifa especial según los TVs que maneje en la vivienda.',
        'El servicio de instalación se establece entre 1 a 6 días hábiles como máximo.'
    ])

const soporteFlow = addKeyword(['Soporte', 'soporte'])
    .addAnswer('Para soporte técnico debes comunicarte a la siguiente línea telefónica para *Bogotá*: 6013080010 y para *Calarcá*: 6013080012. Allí tu solicitud será validada en un lapso no mayor a 24 horas hábiles laboradas.')

const retiroFlow = addKeyword(['Retiro', 'retiro'])
    .addAnswer('Para realizar un retiro debe estar al día en pagos (clausula,equipos,mensualidades). Debe entregar el micronodo junto al cargador o el modem junto al cargador *segun los equipos que maneje en la vividenda*. Además debe presentar una carta de retiro junto a la  copia de la cedula del titular. Si la persona que se presenta es un tercero, debe tener también una carta autorizando el retiro al tercero junto a la copia de la cedula del titular y la de quien presenta la solicitud; Todo esto antes del día 1 del mes que no desea que le facturen.')

const main = async () => {
    const adapterFlow = createFlow([
        welcomeFlow, 
        planesFlow, 
        soporteFlow, 
        condicionesFlow, 
        contratarFlow, 
        oficinasFlow, 
        personaJuridicaBogotaFlow, 
        personaNaturalBogotaFlow, 
        barriosBogota, 
        barriosCalarca, 
        barriosEspecialesBogotaFlow, 
        barriosEspecialesCalarca, 
        calarcaFlow, 
        bogotaFlow, 
        retiroFlow
    ])

    const adapterProvider = createProvider(Provider, {
        experimentalStore: true,
        timeRelease: 60000,
        markReadMessage: true,
        baileyOptions: {
            browser: ['Redetek Bot', 'Chrome', '1.0.0'],
            printQRInTerminal: true,
            auth: {
                creds: {},
                keys: {}
            },
            msgRetryCounterCache: {},
            logger: false,
            mobile: false,
            syncFullHistory: false,
            patchMessageBeforeSending: false,
            reconnectMode: 'auto' 
        }
    })

    adapterProvider.on(EVENTS.connectionUpdate, (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('Intentando reconectar...');
                main();
            } else {
                console.log('Bot deslogueado. Escanea el código QR nuevamente.');
            }
        } else if (connection === 'open') {
            console.log('Conexión establecida.');
        }
    });

    const reconnect = async () => {
        console.log("Attempting to reconnect...");
        await adapterProvider.reconnect();
        console.log("Reconnected successfully.");
    };
    
    process.on('unhandledRejection', async (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        if (reason.message === 'Connection Closed') {
            await reconnect();
        }
    });
    
    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    // Create a rate limiter that allows 3 requests per second
    const limiter = new RateLimiter({ tokensPerInterval: 3, interval: "second" });

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            try {
                await limiter.removeTokens(1);
                const { number, message, urlMedia } = req.body
                await bot.sendMessage(number, message, { media: urlMedia ?? null })
                    .catch(err => {
                        console.error(`Error sending message to ${number}:`, err);
                        throw err;
                    });
                res.status(200).send('Message sent successfully')
            } catch (err) {
                console.error(`Failed to process message for ${req.body.number}:`, err);
                res.status(500).send('Message processing failed');
            }
        })
    )

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            try {
                await limiter.removeTokens(1);
                const { number, name } = req.body
                await bot.dispatch('REGISTER_FLOW', { from: number, name })
                res.status(200).send('Register flow triggered successfully')
            } catch (err) {
                console.error(`Failed to trigger register flow for ${number}:`, err);
                res.status(500).send('Flow trigger failed');
            }
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            try {
                await limiter.removeTokens(1);
                const { number, name } = req.body
                await bot.dispatch('SAMPLES', { from: number, name })
                res.status(200).send('Samples flow triggered successfully')
            } catch (err) {
                console.error(`Failed to trigger samples flow for ${number}:`, err);
                res.status(500).send('Flow trigger failed');
            }
        })
    )

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            try {
                await limiter.removeTokens(1);
                const { number, intent } = req.body
                if (intent === 'remove') bot.blacklist.remove(number)
                if (intent === 'add') bot.blacklist.add(number)
                res.status(200).json({ status: 'ok', number, intent })
            } catch (err) {
                console.error(`Failed to modify blacklist for ${number}:`, err);
                res.status(500).send('Blacklist modification failed');
            }
        })
    )

    // Manejo global de errores no capturados
    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    httpServer(+PORT)
}

main().catch(err => {
    console.error('Failed to start the bot:', err);
    process.exit(1);
});
