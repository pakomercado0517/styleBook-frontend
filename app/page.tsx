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
      {/* Hero Section con Gradient Flow */}
      <section className="gradient-flow relative min-h-screen flex flex-col items-center justify-center px-4 py-16 md:py-0 overflow-hidden">
        {/* Decorative gradient elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Logo & Badge */}
          <div className="mb-6 animate-fade-in">
            <Badge icon="✨" variant="primary">
              Bienvenido a StyleBook
            </Badge>
          </div>

          {/* Main Title */}
          <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up leading-tight">
            Reserva tus Citas de Belleza
          </h1>

          {/* Subtitle */}
          <p className="font-poppins text-lg md:text-xl text-gray-100 mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up">
            Descubre y reserva los mejores servicios de estética. Desde barbería
            y peluquería hasta manicura y tratamientos de belleza.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up">
            <Button size="lg">Comenzar Ahora</Button>
            <Button variant="outline" size="lg">
              Ver Demo
            </Button>
          </div>

          {/* Divider Line */}
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent my-12 opacity-30"></div>

          {/* Role Selector */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12 px-4">
            <span className="text-white font-poppins font-semibold">
              ¿Eres cliente?
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedRole('client')}
                className={`px-6 py-3 rounded-full font-poppins font-semibold transition-all duration-300 ${
                  selectedRole === 'client'
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                }`}
              >
                Cliente
              </button>
              <button
                onClick={() => setSelectedRole('provider')}
                className={`px-6 py-3 rounded-full font-poppins font-semibold transition-all duration-300 ${
                  selectedRole === 'provider'
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                }`}
              >
                Proveedor
              </button>
            </div>
            <span className="text-white font-poppins font-semibold">
              ¿O proveedor?
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="gradient-flow-subtle py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              {selectedRole === 'client'
                ? '¿Por Qué Elegir StyleBook?'
                : 'Potencia tu Negocio'}
            </h2>
            <p className="font-poppins text-gray-600 text-lg max-w-2xl mx-auto">
              {selectedRole === 'client'
                ? 'Experiencia fluida para encontrar y reservar los servicios que te encantan'
                : 'Herramientas completas para gestionar tu negocio de belleza'}
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { number: '50K+', label: 'Usuarios Activos' },
              { number: '95%', label: 'Satisfacción' },
              { number: '24/7', label: 'Soporte' },
            ].map((stat, index) => (
              <div key={index} className="animate-slide-up">
                <div className="gradient-text text-5xl md:text-6xl font-bold mb-3">
                  {stat.number}
                </div>
                <p className="font-poppins text-gray-600 text-lg">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-flow py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para Comenzar?
          </h2>
          <p className="font-poppins text-gray-100 text-lg mb-8">
            Únete a miles de usuarios que ya disfrutan de StyleBook
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Crear Cuenta Gratis</Button>
            <Button variant="secondary" size="lg">
              Explorar Más
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
