import dynamic from "next/dynamic";
import React from "react";

export default function Home() {
  const DynamicComponentWithNoSSR = dynamic(
    () => import('../map'),
    { ssr: false }
  )

  return (
    <div style={{justifyContent:'center',alignItems:'center'}} className="container">
   <DynamicComponentWithNoSSR />
    </div>
  )
}
