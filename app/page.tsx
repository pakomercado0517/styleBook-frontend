'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';

export default function Home(): React.ReactNode {
  const [selectedRole, setSelectedRole] = useState<'client' | 'provider'>(
    'client'
  );

  const clientFeatures = [
    {
      icon: '🔍',
      title: 'Búsqueda Inteligente',
      description: 'Encuentra los mejores servicios de belleza cerca de ti',
    },
    {
      icon: '⭐',
      title: 'Reseñas Verificadas',
      description: 'Lee opiniones reales de otros clientes',
    },
    {
      icon: '📅',
      title: 'Reserva Fácil',
      description: 'Agenda tus citas en segundos',
    },
  ];

  const providerFeatures = [
    {
      icon: '📊',
      title: 'Gestiona tu Negocio',
      description: 'Controla tu agenda y disponibilidad',
    },
    {
      icon: '🎯',
      title: 'Atrae Clientes',
      description: 'Aumenta tu visibilidad y reservas',
    },
    {
      icon: '📈',
      title: 'Análisis en Tiempo Real',
      description: 'Mide el éxito de tu negocio',
    },
  ];

  const features =
    selectedRole === 'client' ? clientFeatures : providerFeatures;

  return (
    <main className="w-full overflow-hidden">
      {/* Hero Section con Luxe Noir */}
      <section className="gradient-luxe relative min-h-screen flex flex-col items-center justify-center px-4 py-16 md:py-0 overflow-hidden">
        {/* Decorative elements - Gold accents */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-accent-500 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"></div>
          <div
            className="absolute bottom-20 right-10 w-80 h-80 bg-accent-400 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-float"
            style={{ animationDelay: '2s' }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-300 rounded-full mix-blend-overlay filter blur-3xl opacity-5 animate-float"
            style={{ animationDelay: '4s' }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Logo & Badge */}
          <div className="mb-8 animate-fade-in">
            <Badge icon="✨" variant="primary">
              Bienvenido a StyleBook
            </Badge>
          </div>

          {/* Main Title */}
          <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up leading-tight">
            Elegancia en Cada{' '}
            <span className="gradient-text-gold">Reserva</span>
          </h1>

          {/* Subtitle */}
          <p className="font-poppins text-lg md:text-xl text-neutral-200 mb-10 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            La plataforma premium para servicios de belleza. Barberías, salones
            y centros estéticos en un solo lugar. Sofisticación y estilo al
            alcance de tu mano.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up">
            <Button variant="gold" size="lg">
              Comenzar Ahora
            </Button>
            <Button variant="secondary" size="lg">
              Ver Servicios
            </Button>
          </div>

          {/* Divider Line */}
          <div className="relative w-full max-w-md mx-auto h-px my-12">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-accent-500 to-transparent opacity-30"></div>
          </div>

          {/* Role Selector */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8 px-4">
            <span className="text-neutral-300 font-poppins font-medium">
              Soy cliente
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedRole('client')}
                className={`px-8 py-3 rounded-full font-poppins font-semibold transition-all duration-300 ${
                  selectedRole === 'client'
                    ? 'bg-accent-500 text-primary-900 shadow-xl shadow-accent-500/30'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm'
                }`}
              >
                Cliente
              </button>
              <button
                onClick={() => setSelectedRole('provider')}
                className={`px-8 py-3 rounded-full font-poppins font-semibold transition-all duration-300 ${
                  selectedRole === 'provider'
                    ? 'bg-accent-500 text-primary-900 shadow-xl shadow-accent-500/30'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm'
                }`}
              >
                Proveedor
              </button>
            </div>
            <span className="text-neutral-300 font-poppins font-medium">
              Soy proveedor
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="gradient-luxe-subtle py-20 md:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <div className="inline-block mb-4">
              <Badge variant="secondary">
                {selectedRole === 'client'
                  ? '👥 Para Clientes'
                  : '💼 Para Proveedores'}
              </Badge>
            </div>
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-primary-800 mb-6">
              {selectedRole === 'client'
                ? '¿Por Qué Elegir StyleBook?'
                : 'Potencia tu Negocio'}
            </h2>
            <p className="font-poppins text-neutral-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              {selectedRole === 'client'
                ? 'Experiencia premium para encontrar y reservar los mejores servicios de belleza con confianza'
                : 'Herramientas profesionales para gestionar tu negocio de belleza con elegancia y eficiencia'}
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-32 px-4 bg-white relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-accent-500 to-transparent opacity-20"></div>

        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h3 className="font-playfair text-3xl md:text-4xl font-bold text-primary-800 mb-3">
              Números que Hablan
            </h3>
            <p className="font-poppins text-neutral-600 text-lg">
              La confianza de miles de usuarios nos respalda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 text-center">
            {[
              { number: '50K+', label: 'Usuarios Activos', icon: '👥' },
              { number: '95%', label: 'Satisfacción', icon: '⭐' },
              { number: '24/7', label: 'Soporte Premium', icon: '💬' },
            ].map((stat, index) => (
              <div
                key={index}
                className="animate-slide-up group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="mb-3 text-4xl group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="gradient-text text-5xl md:text-6xl lg:text-7xl font-bold mb-3 font-playfair">
                  {stat.number}
                </div>
                <p className="font-poppins text-neutral-600 text-lg font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-accent-500 to-transparent opacity-20"></div>
      </section>

      {/* CTA Section */}
      <section className="gradient-luxe-gold relative py-20 md:py-32 px-4 overflow-hidden">
        {/* Decorative gold glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-500 rounded-full filter blur-3xl opacity-20 animate-float"></div>
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Badge variant="primary" className="mb-6">
            🎯 Únete Ahora
          </Badge>

          <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            ¿Listo para la{' '}
            <span className="gradient-text-gold">Excelencia</span>?
          </h2>

          <p className="font-poppins text-neutral-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Únete a miles de usuarios que ya disfrutan de la plataforma más
            elegante para servicios de belleza. Sin complicaciones, solo
            resultados.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gold" size="xl">
              Crear Cuenta Gratis
            </Button>
            <Button variant="secondary" size="xl">
              Explorar Servicios
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-neutral-300 text-sm font-poppins">
            <span className="flex items-center gap-2">
              ✓ Sin tarjeta de crédito
            </span>
            <span className="flex items-center gap-2">
              ✓ Cancela cuando quieras
            </span>
            <span className="flex items-center gap-2">✓ Soporte dedicado</span>
          </div>
        </div>
      </section>
    </main>
  );
}
