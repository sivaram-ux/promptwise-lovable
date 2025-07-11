import { useInView } from "framer-motion";
import { useRef } from "react";

export const useScrollReveal = (amount = 0.1) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    amount,
    once: true,
    margin: "-50px"
  });

  return { ref, isInView };
};