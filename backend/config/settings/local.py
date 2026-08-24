from .base import *
from decouple import config

DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME', default='kangaroo_international_collage_digital'),
        'USER': config('DB_USER', default='kic_admin_user'),
        'PASSWORD': config('DB_PASSWORD', default='123456789'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]