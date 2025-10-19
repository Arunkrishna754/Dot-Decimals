import React, { lazy } from "react";
import Banner from "../../componets/website/Banner";
import ContactForm from "../../componets/common/ContactForm";
import Policy from "../../componets/landingPages/policy";
const MapComponent = lazy(() => import("../../componets/website/MapComponent"));

const PrivacyPolicy = () => {
  return (
    <>
      <Banner page="Privacy-Policy" />
      <Policy />
      
    </>
  );
};

export default PrivacyPolicy;
