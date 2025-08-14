import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Head from "next/head";
import { LocalizationProvider } from '@mui/x-date-pickers';
import Script from "next/script";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { esES } from '@mui/x-date-pickers/locales';
import "dayjs/locale/es"; // Import Spanish locale
import dayjs from "dayjs";

dayjs.locale("es"); // Set global locale to Spanish
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <Script src="/register-sw.js" defer></Script>
        <link rel="manifest" href="/manifest.webmanifest" />
      </Head>
      <SessionProvider session={session}>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale="es" // This sets the dayjs locale
          localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
        >
          <Component {...pageProps} />
        </LocalizationProvider>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
