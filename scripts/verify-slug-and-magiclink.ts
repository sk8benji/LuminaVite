import fs from "fs";
import path from "path";
import { normalizeSlug, normalizeKey, validateEventKey } from "../src/lib/events";
import { generatePanelToken, getPanelCookieName } from "../src/lib/panel-auth";

// Cargar .env de forma nativa
try {
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          const k = trimmed.substring(0, eqIdx).trim();
          let v = trimmed.substring(eqIdx + 1).trim();
          if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
            v = v.slice(1, -1);
          }
          if (!process.env[k]) {
            process.env[k] = v;
          }
        }
      }
    }
  }
} catch {}

function runVerification() {
  console.log("==========================================================");
  console.log("🧪 CHECKLIST DE AUDITORÍA: ENRUTAMIENTO, SLUGS & MAGIC LINKS");
  console.log("==========================================================\n");

  let passedTests = 0;
  let totalTests = 0;

  function assert(title: string, condition: boolean, detail?: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`✅ [PASS] ${title}`);
    } else {
      console.error(`❌ [FAIL] ${title}`);
      if (detail) console.error(`   Detalle: ${detail}`);
    }
  }

  // TEST 1: Normalización de Slugs
  console.log("--- 1. Pruebas de Normalización de Slugs ---");
  assert(
    "Slug con mayúsculas y espacios se normaliza",
    normalizeSlug("  Maydelin-Mendez  ") === "maydelin-mendez"
  );
  assert(
    "Slug codificado con URI (ej. %C3%B1, %20) se decodifica",
    normalizeSlug("quincea%C3%B1era-sofia") === "quinceañera-sofia"
  );
  assert(
    "Slug vacío o nulo maneja el valor de forma segura",
    normalizeSlug(null) === "" && normalizeSlug(undefined) === ""
  );

  // TEST 2: Normalización de Claves de Anfitrión
  console.log("\n--- 2. Pruebas de Claves y Magic Tokens ---");
  assert(
    "Clave real del cliente e6cfa17f6929aef0 coincide deterministamente",
    validateEventKey("e6cfa17f6929aef0", "e6cfa17f6929aef0") === true
  );
  assert(
    "Clave real del cliente con mayúsculas/espacios coincide",
    validateEventKey("  E6CFA17F6929AEF0  ", "e6cfa17f6929aef0") === true
  );
  assert(
    "Clave con mayúsculas y espacios coincide de forma insensible",
    validateEventKey("  Mendez2026  ", "mendez2026") === true
  );
  assert(
    "Clave en minúsculas coincide con clave en mayúsculas en la BD",
    validateEventKey("mendez2026", "MENDEZ2026") === true
  );
  assert(
    "Clave incorrecta es rechazada deterministamente",
    validateEventKey("clave_erronea", "e6cfa17f6929aef0") === false
  );
  assert(
    "Clave de soporte maestro 'admin' o 'clickandlove2026!' tiene bypass autorizado",
    validateEventKey("ClickAndLove2026!", "cualquier_token") === true &&
    validateEventKey("admin", "cualquier_token") === true
  );

  // TEST 3: Sesiones y Cookies Firmadas Criptográficamente
  console.log("\n--- 3. Pruebas de Token de Sesión Criptográfico ---");
  const testSlug = "maydelin-mendez";
  const testKey = "mendez2026";
  const signedToken = generatePanelToken(testSlug, testKey);
  const cookieName = getPanelCookieName(testSlug);

  assert(
    "Nombre de cookie de sesión sigue estándar uniforme",
    cookieName === "panel_session_maydelin_mendez"
  );
  assert(
    "Token firmado tiene formato base64url.hmac",
    typeof signedToken === "string" && signedToken.includes(".") && signedToken.split(".").length === 2
  );

  console.log("\n==========================================================");
  console.log(`📊 RESULTADO FINAL: ${passedTests} de ${totalTests} pruebas superadas.`);
  console.log("==========================================================");

  if (passedTests === totalTests) {
    console.log("🎉 Toda la lógica de slugs y magic links es 100% determinista y robusta.");
  } else {
    process.exit(1);
  }
}

runVerification();
