import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

function Cartpage() {
  const t = useTranslations('cart');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        </div>

        {/* Empty Cart State */}
        <Card className="text-center py-12">
          <CardContent>
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {t('empty')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('emptyDescription')}
            </p>
            <Button asChild>
              <Link href="/all">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('continueShopping')}
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Cart Items would go here */}
        {/* This is a placeholder - you would implement the actual cart functionality */}
      </div>
    </div>
  );
}

export default Cartpage;