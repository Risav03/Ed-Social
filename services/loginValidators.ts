import crypto from "crypto"

const HASH_ITERATIONS = 100000;
const HASH_KEYLEN = 64;
const HASH_DIGEST = 'sha512';

interface HashedPassword {
    hash: string;
    salt: string;
}

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};


export const isValidPassword = (password: string): boolean => {
    return password.length >= 8;
};

export const hashPassword = async (password: string, salt?: string): Promise<HashedPassword> => {
    const generateSalt = salt || crypto.randomBytes(16).toString('hex');

    return new Promise((resolve, reject) => {
        crypto.pbkdf2(
            password,
            generateSalt,
            HASH_ITERATIONS,
            HASH_KEYLEN,
            HASH_DIGEST,
            (err, derivedKey) => {
                if (err) reject(err);
                resolve({
                    hash: derivedKey.toString('hex'),
                    salt: generateSalt
                });
            }
        );
    });
};
