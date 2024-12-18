import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';

// Validation schema using Yup
const validationSchema = yup.object({
  Fundamental: yup.object({
    transparency: yup.string().notRequired(),
    vc_funding: yup.string().notRequired(),
    business_risk_volatility: yup.string().notRequired(),
    revenue_growth: yup.string().notRequired(),
    engagement: yup.string().notRequired(),
  }),
  Technical: yup.object({
    rsi_value: yup.number().notRequired(),
    price: yup.number().notRequired(),
    ma9_ma20_value: yup.string().notRequired(),
  }),
  Quant: yup.object({
    marketcapitalization: yup.number().notRequired(),
    volume: yup.number().notRequired(),
  }),
  ticker_list: yup.array().of(yup.string()).notRequired(),
});

// Formik component
const FormikWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialValues = {
    Fundamental: {
        transparency: ['Active'],
        vc_funding: [ "4", "5"],
        business_risk_volatility: ["1", "2", "3"],
        revenue_growth: ["3", "4", "5"],
        engagement: ["3", "4", "5"],
    },
    Technical: {
        rsi_value: [30],
        price: [30],
        ma9_ma20_value: ["Yes"],
    },
    Quant: {
        marketcapitalization: [500],
        volume: [25],
    },
    ticker_list: [],
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ values, handleChange, handleBlur }) => (
        <Form>
          {/* Render children and form fields */}
          {children}
        </Form>
      )}
    </Formik>
  );
};

export default FormikWrapper;
