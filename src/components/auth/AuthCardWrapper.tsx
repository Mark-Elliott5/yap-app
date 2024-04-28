'use client';

import { Archivo_Black } from 'next/font/google';

import CardBackButton from '@/src/components/auth/AuthCardBackButton';
import OAuthLogins from '@/src/components/auth/OAuthLogins';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { cn } from '@/src/lib/utils';

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
});

function AuthCardWrapper({
  children,
  cardDescription,
  backButtonLabel,
  backButtonHref,
  showOAuth,
}: {
  children: React.ReactNode;
  cardDescription: string;
  backButtonLabel?: string;
  backButtonHref?: string;
  showOAuth: boolean;
}) {
  return (
    <div className='w-11/12 rounded-lg bg-gradient-to-br from-yap-red-500 to-orange-500 p-[1px] sm:w-[400px]'>
      <Card className=''>
        <CardHeader>
          <CardTitle className={cn('text-yap-red-500', archivoBlack.className)}>
            yap
          </CardTitle>
          <CardDescription className=''>{cardDescription}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        {showOAuth && (
          <CardContent className='flex gap-x-2'>
            <OAuthLogins />
          </CardContent>
        )}
        {backButtonHref && backButtonLabel && (
          <CardFooter>
            <CardBackButton label={backButtonLabel} href={backButtonHref} />
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default AuthCardWrapper;
