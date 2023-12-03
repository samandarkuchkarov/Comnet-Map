import '../styles.scss'
import Head from "next/head";
import Link from "next/link";
// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return <>
      <Head>
      <link
            rel="preload"
            href="/Rubik-Medium.ttf"
            as="font"
            crossOrigin=""
          />
      </Head>
      <Component {...pageProps} />
    </>
}