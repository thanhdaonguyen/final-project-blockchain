export async function generateKey(): Promise<{
    privateKey: CryptoKey | null;
    publicKey: CryptoKey | null;
}> {
    try {
        const keyPair = await crypto.subtle.generateKey(
            {
                name: "ECDSA",
                namedCurve: "P-256",
            },
            true,
            ["sign", "verify"]
        );
        return {
            privateKey: keyPair.privateKey,
            publicKey: keyPair.publicKey,
        };
    } catch (error) {
        console.error("Error generating key pair:", error);
        return {
            privateKey: null,
            publicKey: null,
        };
    }
}


export async function exportKeyToString(
    key: CryptoKey | null
): Promise<string | null> {
    try {
        const exportedKey = await crypto.subtle.exportKey("jwk", key as CryptoKey);
        return JSON.stringify(exportedKey);
    } catch (error) {
        console.error("Error exporting key to string:", error);
        return null;
    }
}

export async function importKeyFromString(
    keyString: string,
    keyUsage: KeyUsage[]
): Promise<CryptoKey | null> {
    try {
        const jwk = JSON.parse(keyString);
        return await crypto.subtle.importKey(
            "jwk",
            jwk,
            {
                name: "ECDSA",
                namedCurve: "P-256",
            },
            true,
            keyUsage
        );
    } catch (error) {
        console.error("Error importing key from string:", error);
        return null;
    }
}

export function bufferSourceToString(signature: ArrayBuffer): string | null {
    try {
        return btoa(String.fromCharCode(...new Uint8Array(signature)));
    } catch (error) {
        console.error("Error converting buffer source to string:", error);
        return null;
    }
}

export function stringToBufferSource(base64String: string): ArrayBuffer | null {
    try {
        const binaryString = atob(base64String);
        const byteArray = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            byteArray[i] = binaryString.charCodeAt(i);
        }
        return byteArray.buffer;
    } catch (error) {
        console.error("Error converting string to buffer source:", error);
        return null;
    }
}

export async function isCorrectHash(
    certHash: string,
    fileData: string
): Promise<boolean> {
    try {
        const hashBuffer = await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(fileData)
        );
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
        return hashHex === certHash;
    } catch (error) {
        console.error("Error checking hash correctness:", error);
        return false;
    }
}


export async function signData(
    privateKey: string,
    data: string
): Promise<string | null> {
    try {
        const convertedPrivateKey = await importKeyFromString(privateKey, [
            "sign",
        ]);
        if (!convertedPrivateKey) {
            return null;
        }
        const signature = await crypto.subtle.sign(
            {
                name: "ECDSA",
                hash: { name: "SHA-256" },
            },
            convertedPrivateKey,
            new TextEncoder().encode(data)
        );
        return bufferSourceToString(signature);
    } catch (error) {
        console.error("Error signing data:", error);
        return null;
    }
}

export async function verifySignature(
    publicKey: string,
    signature: string,
    data: string,
): Promise<boolean> {
    try {
        const convertedPublicKey = await importKeyFromString(
            publicKey,
            ["verify"]
        );
        if (!convertedPublicKey) {
            return false;
        }
        const convertedSignature = stringToBufferSource(signature);
        const convertedData = new TextEncoder().encode(data);
        if (!convertedSignature || !convertedData) {
            return false;
        }
        return await crypto.subtle.verify(
            {
                name: "ECDSA",
                hash: { name: "SHA-256" },
            },
            convertedPublicKey,
            convertedSignature,
            convertedData
        );
    } catch (error) {
        console.error("Error during signature verification:", error);
        return false;
    }
}

(async () => {
    // Generate a key pair
    let { privateKey, publicKey } = await generateKey();

    // Export keys to strings
    let privateKeyString = await exportKeyToString(privateKey!);
    let publicKeyString = await exportKeyToString(publicKey!);

    privateKey = await importKeyFromString(privateKeyString!, ["sign"]);
    publicKey = await importKeyFromString(publicKeyString!, ["verify"]);

    // Data to sign
    const data = "Hello, world!";

    // Sign the data
    const signature = await signData(privateKeyString!, data);
    console.log("Signature:", signature);

    // Verify the signature
    const isValid = await verifySignature(publicKeyString!, signature!, data);
    console.log("Is signature valid?", isValid);
})();