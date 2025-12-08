const { remote } = require("webdriverio");
const path = require("path");

async function runTest() {
    const appPath = path.resolve(__dirname, "../../dist/prime_app_mobile.apk");

    console.log("📦 Cargando APK desde:", appPath);

    const driver = await remote({
        path: "/",
        port: 4723,
        hostname: "192.168.1.68",
        logLevel: "info",
        capabilities: {
            platformName: "Android",
            "appium:deviceName": "XK7PWGVCV8FEIN59",
            "appium:automationName": "UiAutomator2",
            "appium:app": appPath,
            "appium:appPackage": "com.hatux.prime_app",
            "appium:appActivity": "com.hatux.prime_app.MainActivity",
            "appium:autoGrantPermissions": true,
            "appium:disableWindowAnimation": true,
            "appium:ignoreHiddenApiPolicyError": true,
        },
    });

    console.log("✅ App instalada e iniciada correctamente...");

    const matricula = await driver.$("~input-matricula");
    const password = await driver.$("~input-password");
    const boton = await driver.$("~btn-login");

    await matricula.setValue("20221026");
    await password.setValue("hshg6619.");
    await boton.click();

    await driver.pause(5000);
    console.log("🚀 Login ejecutado correctamente (verifica la pantalla en el dispositivo).");

    await driver.deleteSession();
}

runTest().catch(console.error);
