import { ThemeProvider } from "next-themes";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
      <body >
        <ThemeProvider
          attribute="class"
   
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>

  );
}
