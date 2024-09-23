import React from 'react';

export const metadata = {
  title: 'Image Converter',
  description: 'Convert your images easily',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}