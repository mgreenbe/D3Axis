import { motion, AnimatePresence } from "framer-motion";

export function Motion() {
  return (
    <AnimatePresence>
      <motion.div exit={{ x: "-100vh", opacity: 0 }}>
        I have some content in here
      </motion.div>
    </AnimatePresence>
  );
}
