// Device biometric unlock with WebAuthn (fingerprint on Android, Face ID on iPhone).
// Prototype only: there is no server, so the assertion is not verified remotely.
const rand = (n) => crypto.getRandomValues(new Uint8Array(n));
const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

export async function biometricAvailable() {
	try {
		return !!window.PublicKeyCredential && (await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());
	} catch {
		return false;
	}
}

export async function registerBiometric(phone) {
	const cred = await navigator.credentials.create({
		publicKey: {
			challenge: rand(32),
			rp: { name: 'MajiMap' },
			user: { id: rand(16), name: phone, displayName: phone },
			pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
			authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', residentKey: 'discouraged' },
			timeout: 60000
		}
	});
	return b64(cred.rawId);
}

export async function verifyBiometric(credentialId) {
	await navigator.credentials.get({
		publicKey: {
			challenge: rand(32),
			allowCredentials: [{ type: 'public-key', id: unb64(credentialId), transports: ['internal'] }],
			userVerification: 'required',
			timeout: 60000
		}
	});
	return true;
}
