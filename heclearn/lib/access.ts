// Interrupteur d'accès : REQUIRE_LOGIN=false ouvre la lecture des fiches et QCM sans connexion.
// Tout autre valeur (ou variable absente) = connexion obligatoire. Seuls le tableau de bord,
// l'enregistrement des scores, les signalements et /admin exigent toujours un compte.
export const LOGIN_REQUIRED = process.env.REQUIRE_LOGIN !== "false";
