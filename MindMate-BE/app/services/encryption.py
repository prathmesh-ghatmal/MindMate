from cryptography.fernet import Fernet
from app.core.config import settings

cipher = Fernet(settings.CHAT_ENCRYPTION_KEY)


def encrypt_message(plaintext: str) -> str:
    return cipher.encrypt(plaintext.encode()).decode()

def decrypt_message(ciphertext: str) -> str:
    return cipher.decrypt(ciphertext.encode()).decode()
