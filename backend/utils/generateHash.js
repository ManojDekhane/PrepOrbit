const bcrypt = require("bcryptjs");

const plainPassword = "admin123";

(async () => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(plainPassword, salt);
        console.log(`Plain Password: ${plainPassword}`);
        console.log(`Hashed Password: ${hashed}`);
    } catch (err) {
        console.error("Error hashing password:", err);
    }
})();