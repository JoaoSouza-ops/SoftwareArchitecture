import multer from "multer";

/**
 * Middleware Compartilhado de Upload (Multer)
 * 
 * Decisão de Design:
 * - memoryStorage(): Guardamos os bytes do arquivo em memória (Buffer) em vez de gravar no disco.
 *   Isso é ideal porque vamos repassar esse buffer diretamente para o Sharp processar.
 * - fileSize: 5MB (impede ataques de DoS por uploads gigantescos).
 * - fileFilter: Validação de tipos permitidos (JPEG, PNG, WebP).
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5 MB
  },
  fileFilter: (req, file, callback) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Formato de imagem não permitido");
      error.statusCode = 400;
      return callback(error);
    }

    callback(null, true);
  }
});

export default upload;
