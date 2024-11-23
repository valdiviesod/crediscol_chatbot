import { createBot, createProvider, createFlow, addKeyword, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { RateLimiter } = require('limiter');

const PORT = process.env.PORT ?? 3000

const welcomeFlow = addKeyword(EVENTS.WELCOME)
    .addAnswer([
        '¡Bienvenido! Te comunicas con el *Bot Automático* 🤖 de la Cooperativa Crediscol. ¿En qué trámite puedo ayudarte?',
        'Por favor escriba un número de acuerdo a su solicitud',
        '1️⃣ Afiliaciones.',
        '2️⃣ Solicitudes de créditos.',
        '3️⃣ Devoluciones de aportes.',
        '4️⃣ Estados de cuenta.',
        '5️⃣ Desafiliaciones.',
        '6️⃣ Trámites por fallecimiento.',
        '7️⃣ Auxilios.',
        '8️⃣ Paz y salvo.',
        '9️⃣ Otros servicios.',
    ]);

const afiliacionesFlow = addKeyword(['1']).addAnswer([
    '🔹 *Requisitos para solicitar una afiliación*:',
    '1. Copia de Cédula ampliada al 150%.',
    '2. Últimos 3 desprendibles de nómina.',
    '3. Resolución o certificado de pensión.',
    '4. Recibo de Servicio Público (agua o luz).',
]);

const creditosFlow = addKeyword(['2']).addAnswer([
    '🔹 *Requisitos para solicitar un crédito*:',
    '1. Copia de Cédula ampliada al 150%.',
    '2. Últimos 3 desprendibles de nómina.',
    '3. Recibo de Servicio Público (agua o luz).',
]);

const aportesFlow = addKeyword(['3']).addAnswer([
    '🔹 *Requisitos para solicitar la devolución de aportes*:',
    '1. Estar a paz y salvo por todo concepto.',
    '2. Radicar carta escrita solicitando la devolución de aportes.',
]);

const estadoFlow = addKeyword(['4']).addAnswer([
    '🔹 *Requisitos para solicitar el estado de cuenta*:',
    '1. Consignar $15.000 pesos en nuestras cuentas de recaudo e ingresar a www.crediscol.com en la opción PAGOS EN LÍNEA.',
    '2. Radicar carta indicando el motivo de la solicitud, incluyendo dirección de correo electrónico y número de cédula.',
]);

const desafiliacionesFlow = addKeyword(['5']).addAnswer([
    '🔹 *Requisitos para solicitar una desafiliación*:',
    '1. Estar a paz y salvo por todo concepto.',
    '2. Radicar carta escrita solicitando el retiro de la Cooperativa.',
]);

const fallecidoFlow = addKeyword(['6']).addAnswer([
    '🔹 *Requisitos para trámites por fallecimiento*:',
    '1. Registro Civil de Defunción (original o copia autenticada).',
    '2. Carta solicitando la devolución de aportes.',
    '3. Carta solicitando auxilio por fallecimiento.',
    '4. Fotocopia de la Cédula del asociado fallecido y del beneficiario.',
    '5. Si es cónyuge: copia del Registro de Matrimonio.',
    '6. Si son hijos: copia del Registro de Nacimiento.',
]);

const seleccionAuxFlow = addKeyword(['7'])
    .addAnswer([
        '🔹 *Tipos de auxilios disponibles*:',
        'Escriba *hospitalizacion*: Para auxilio por hospitalización.',
        'Escriba *fallecimiento*: Para auxilio por fallecimiento.',
        'Escriba *calamidad*: Para auxilio por calamidad doméstica.',
        'Escriba *familiar*: Para auxilio por fallecimiento de familiar.',
    ]);

const hospitalizacionFlow = addKeyword(['hospitalización', 'hospitalizacion']).addAnswer([
    '🔹 *Requisitos para auxilio por hospitalización*:',
    '1. Tener crédito vigente.',
    '2. La hospitalización debe ser mayor a 3 días.',
    '3. Carta solicitando auxilio.',
    '4. Certificación de ingreso y egreso del hospital.',
    '5. No debe superar los 60 días desde el evento.',
]);

const fallecimientoFlow = addKeyword(['fallecimiento']).addAnswer([
    '🔹 *Requisitos para auxilio por fallecimiento*:',
    '1. Registro Civil de Defunción.',
    '2. Copia de Cédula del beneficiario.',
    '3. Carta solicitando el auxilio.',
]);

const calamidadFlow = addKeyword(['calamidad']).addAnswer([
    '🔹 *Requisitos para auxilio por calamidad doméstica*:',
    '1. Carta solicitando el auxilio.',
    '2. Certificación de la JAC o entidad que atendió la calamidad.',
    '3. Cotización del material para resarcir los daños.',
]);

const fallecimientoFamiliarFlow = addKeyword(['familiar']).addAnswer([
    '🔹 *Requisitos para auxilio por fallecimiento de familiar*:',
    '1. Carta solicitando el auxilio.',
    '2. Registro Civil de Defunción original o copia autenticada.',
    '3. Registro Civil del beneficiario que certifique el parentesco.',
]);

const pazYSalvoFlow = addKeyword(['8']).addAnswer([
    '🔹 *Requisitos para solicitar Paz y Salvo*:',
    '1. Estar al día con las obligaciones crediticias y de aportes.',
    '2. Radicar carta de solicitud al correo jefecredito@crediscol.com.',
]);

const otrosFlow = addKeyword(['9']).addAnswer([
    'Para otros servicios, por favor comunícate con nuestra línea de atención al cliente: (601) 3297199.',
]);

const main = async () => {
    const adapterFlow = createFlow([
        welcomeFlow,
        afiliacionesFlow, 
        creditosFlow, 
        aportesFlow, 
        estadoFlow, 
        desafiliacionesFlow, 
        fallecidoFlow, 
        seleccionAuxFlow,
        hospitalizacionFlow,
        fallecimientoFlow,
        calamidadFlow,
        fallecimientoFamiliarFlow,
        pazYSalvoFlow,
        otrosFlow
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
