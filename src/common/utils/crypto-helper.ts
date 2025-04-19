import * as crypto from 'crypto';

// RSA 공개키와 개인키 생성
export const generateRSAKeyPair = (): {
  publicKey: string;
  privateKey: string;
} => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki', // 공개키 인코딩 형식
      format: 'pem', // PEM 형식
    },
    privateKeyEncoding: {
      type: 'pkcs8', // 개인키 인코딩 형식
      format: 'pem', // PEM 형식
    },
  });

  return { publicKey, privateKey };
};

// AES-256-CBC 대칭 암호화 (SHA-256을 통해 키 변환)
export const encryptAES = (password: string, data: string): string => {
  // 1. 비밀번호를 SHA-256 해시를 사용하여 32바이트(256비트) AES 키로 변환
  const key = crypto.createHash('sha256').update(password).digest();

  // 2. AES-256-CBC 방식에서는 16바이트(128비트) 초기화 벡터(IV)가 필요함
  const iv = crypto.randomBytes(16);

  // 3. AES-256-CBC 암호화 객체 생성 (key와 iv를 사용)
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  // 4. 입력 데이터를 'utf8'에서 암호화하여 'base64'로 인코딩
  let encrypted = cipher.update(data, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  // 5. IV(초기화 벡터)와 암호문을 ":" 구분자로 합쳐서 반환 (복호화 시 분리 가능)
  return `${iv.toString('base64')}:${encrypted}`;
};

// AES-256-CBC 대칭 복호화
export const decryptAES = (password: string, encryptedData: string): string => {
  // 1. 비밀번호를 SHA-256 해시를 사용하여 32바이트(256비트) AES 키로 변환
  const key = crypto.createHash('sha256').update(password).digest();

  // 2. 저장된 암호문에서 IV와 암호문을 분리
  const [ivBase64, encryptedBase64] = encryptedData.split(':');

  // 3. IV와 암호문을 base64에서 Buffer 형태로 변환
  const iv = Buffer.from(ivBase64, 'base64');
  const encrypted = Buffer.from(encryptedBase64, 'base64');

  // 4. AES-256-CBC 복호화 객체 생성
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

  // 5. 암호문을 base64에서 원래의 'utf8' 문자열로 복호화
  const decrypted = decipher.update(encrypted); // Buffer 사용
  return Buffer.concat([decrypted, decipher.final()]).toString('utf8');
};
