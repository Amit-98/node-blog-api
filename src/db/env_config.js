const db_key = "devlopment";// local, devlopment, production

const PORT_CONFIG = db_key === "devlopment" ? 3000 : 3001;

export { db_key, PORT_CONFIG };
