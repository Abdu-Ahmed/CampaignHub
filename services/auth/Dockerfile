# Auth Service Dockerfile
FROM php:8.2-fpm

WORKDIR /var/www/html

# Install system dependencies first
RUN apt-get update && apt-get install -y \
    bash \
    git \
    curl \
    zip \
    unzip \
    default-mysql-client \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions with proper error handling
RUN docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    mbstring \
    xml \
    xmlwriter \
    zip \
    dom \
    && php -m | grep -E "(mbstring|xml|dom|pdo_mysql|zip)" || exit 1

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application code
COPY . .

# Install PHP dependencies (including dev dependencies for testing)
RUN composer install --optimize-autoloader

# Ensure vendor/bin has proper permissions
RUN chmod +x vendor/bin/* 2>/dev/null || true

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Generate application key if .env exists
RUN if [ -f .env ]; then php artisan key:generate; fi

EXPOSE 80

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=80"]