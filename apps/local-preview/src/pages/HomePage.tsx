import { Hero, Button, Card, CardHeader, CardBody } from '@huble/ui';
import cmsData from '../mock-content/cms-data.json';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero
        heading={cmsData.hero.heading}
        description={cmsData.hero.description}
        primaryCta={
          <Button variant="primary" size="lg">
            {cmsData.hero.primaryCta.label}
          </Button>
        }
        secondaryCta={
          <Button variant="outline" size="lg">
            {cmsData.hero.secondaryCta.label}
          </Button>
        }
        imageSrc={cmsData.hero.imageSrc}
        imageAlt={cmsData.hero.imageAlt}
        imagePosition="right"
      />

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Core Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for modern HubSpot development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cmsData.features.map((feature, index) => (
              <Card key={index} variant="elevated">
                <CardHeader>
                  <div className="text-4xl mb-2">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-600">{feature.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Core Web Vitals Performance
            </h2>
            <p className="text-xl text-primary-100">
              Optimized for speed and user experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cmsData.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-lg text-primary-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start building modern, performant HubSpot websites today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg">
              View Documentation
            </Button>
            <Button variant="secondary" size="lg">
              Explore Components
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
